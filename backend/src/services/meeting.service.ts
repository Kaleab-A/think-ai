import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Meeting, MeetingStatus } from "../database/entities/meeting.entity";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import { CreateMeetingDto } from "../database/dto/meeting.dto";
import {
  Event,
  EventLocationEnumType,
} from "../database/entities/event.entity";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
} from "../database/entities/integration.entity";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { validateGoogleToken } from "./integration.service";
import { googleOAuth2Client } from "../config/oauth.config";
import { google } from "googleapis";
import { validateZoomToken, validateMicrosoftToken } from "./integration.service";

export const getUserMeetingsService = async (
  userId: string,
  filter: MeetingFilterEnumType
) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);

  const where: any = { user: { id: userId } };

  if (filter === MeetingFilterEnum.UPCOMING) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  } else if (filter === MeetingFilterEnum.PAST) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = LessThan(new Date());
  } else if (filter === MeetingFilterEnum.CANCELLED) {
    where.status = MeetingStatus.CANCELLED;
  } else {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  }

  const meetings = await meetingRepository.find({
    where,
    relations: ["event"],
    order: { startTime: "ASC" },
  });

  return meetings || [];
};

export const createMeetBookingForGuestService = async (
  createMeetingDto: CreateMeetingDto
) => {
  const { eventId, guestEmail, guestName, additionalInfo } = createMeetingDto;
  const startTime = new Date(createMeetingDto.startTime);
  const endTime = new Date(createMeetingDto.endTime);

  const eventRepository = AppDataSource.getRepository(Event);
  const integrationRepository = AppDataSource.getRepository(Integration);
  const meetingRepository = AppDataSource.getRepository(Meeting);

  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false },
    relations: ["user"],
  });

  if (!event) throw new NotFoundException("Event not found");

  if (!Object.values(EventLocationEnumType).includes(event.locationType)) {
    throw new BadRequestException("Invalid location type");
  }

  const meetIntegration = await integrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum[event.locationType],
    },
  });

  if (!meetIntegration)
    throw new BadRequestException("No video conferencing integration found");

  let meetLink: string = "";
  const eventIdMap: Record<string, string> = {}; // provider => eventId
  let calendarAppType: string = "";

  if (event.locationType === EventLocationEnumType.GOOGLE_MEET_AND_CALENDAR) {
    const { calendar, calendarType } = await getCalendarClient(
      meetIntegration.app_type,
      meetIntegration.access_token,
      meetIntegration.refresh_token,
      meetIntegration.expiry_date
    );
    const fbResp = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: (
          ((meetIntegration.metadata as any)?.selectedCalendarIds as
            | string[]
            | undefined) ?? ["primary"]
        ).map((id) => ({ id }))
      }
    });
    const overlaps = fbResp.data.calendars
      ? Object.values(fbResp.data.calendars).some(c => c.busy?.length)
      : false;

    if (overlaps) {
      throw new BadRequestException('Time slot is no longer available');
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${guestName} - ${event.title}`,
        description: additionalInfo,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email: guestEmail }, { email: event.user.email }],
        conferenceData: {
          createRequest: {
            requestId: `${event.id}-${Date.now()}`,
          },
        },
      },
    });

    meetLink = response.data.hangoutLink!;
    eventIdMap[IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR] = response.data.id!;
    calendarAppType = calendarType;
  } else if (event.locationType === EventLocationEnumType.ZOOM_MEETING) {
    // --- Check Google calendars for conflicts first ---
    const googleIntegration = await integrationRepository.findOne({
      where: {
        user: { id: event.user.id },
        app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      },
    });

    if (!googleIntegration) {
      throw new BadRequestException("Google Calendar is not connected");
    }

    const { calendar } = await getCalendarClient(
      googleIntegration.app_type,
      googleIntegration.access_token,
      googleIntegration.refresh_token!,
      googleIntegration.expiry_date
    );

    const selectedIds =
      ((googleIntegration.metadata as any)?.selectedCalendarIds as
        | string[]
        | undefined) ?? ["primary"];

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: selectedIds.map((id) => ({ id })),
      },
    });

    const overlap = Object.values(fb.data.calendars ?? {}).some(
      (c) => c.busy && c.busy.length > 0
    );

    if (overlap) {
      throw new BadRequestException("Time slot is no longer available");
    }

    const validToken = await validateZoomToken(
      meetIntegration.access_token,
      meetIntegration.refresh_token!,
      meetIntegration.expiry_date
    );

    const zoomResp = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: `${guestName} - ${event.title}`,
        type: 2, // scheduled meeting
        start_time: startTime.toISOString(),
        duration: (endTime.getTime() - startTime.getTime()) / 60000,
        timezone: "UTC",
        settings: { join_before_host: false },
      }),
    });

    if (!zoomResp.ok) {
      throw new BadRequestException("Failed to create Zoom meeting");
    }
    const zoomData: any = await zoomResp.json();
    meetLink = zoomData.join_url;
    eventIdMap[IntegrationAppTypeEnum.ZOOM_MEETING] = zoomData.id.toString();
    calendarAppType = IntegrationAppTypeEnum.ZOOM_MEETING;
  } else if (
    event.locationType === EventLocationEnumType.OUTLOOK_CALENDAR ||
    event.locationType === EventLocationEnumType.MICROSOFT_TEAMS
  ) {
    // --- Check Google calendars for conflicts first (same as Zoom path) ---
    const googleIntegration = await integrationRepository.findOne({
      where: {
        user: { id: event.user.id },
        app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      },
    });

    if (!googleIntegration) {
      throw new BadRequestException("Google Calendar is not connected");
    }

    const { calendar } = await getCalendarClient(
      googleIntegration.app_type,
      googleIntegration.access_token,
      googleIntegration.refresh_token!,
      googleIntegration.expiry_date
    );

    const selectedIds =
      ((googleIntegration.metadata as any)?.selectedCalendarIds as
        | string[]
        | undefined) ?? ["primary"];

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: selectedIds.map((id) => ({ id })),
      },
    });

    const overlap = Object.values(fb.data.calendars ?? {}).some(
      (c) => c.busy && c.busy.length > 0
    );

    if (overlap) {
      throw new BadRequestException("Time slot is no longer available");
    }

    // --- Create Outlook / Teams event via Microsoft Graph ---
    const validToken = await validateMicrosoftToken(
      meetIntegration.access_token,
      meetIntegration.refresh_token ?? "",
      meetIntegration.expiry_date
    );

    const msEvent: any = {
      subject: `${guestName} - ${event.title}`,
      body: {
        contentType: "HTML",
        content: additionalInfo || "",
      },
      start: { dateTime: startTime.toISOString(), timeZone: "UTC" },
      end: { dateTime: endTime.toISOString(), timeZone: "UTC" },
      attendees: [
        {
          emailAddress: { address: guestEmail, name: guestName },
          type: "required",
        },
        {
          emailAddress: { address: event.user.email, name: event.user.email },
          type: "required",
        },
      ],
    };

    if (event.locationType === EventLocationEnumType.MICROSOFT_TEAMS) {
      msEvent.isOnlineMeeting = true;
      msEvent.onlineMeetingProvider = "teamsForBusiness";
    }

    const msResp = await fetch("https://graph.microsoft.com/v1.0/me/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msEvent),
    });

    if (!msResp.ok) {
      throw new BadRequestException("Failed to create Outlook/Teams meeting");
    }

    const msData: any = await msResp.json();

    meetLink =
      event.locationType === EventLocationEnumType.MICROSOFT_TEAMS
        ? msData.onlineMeeting?.joinUrl || ""
        : "";
    eventIdMap[IntegrationAppTypeEnum[event.locationType]] = msData.id;
    calendarAppType = IntegrationAppTypeEnum[event.locationType];
  }

  // ---- Mirror event into any OTHER connected calendars (Google / Outlook) ----
  // Fetch host integrations again (could reuse earlier lookups)
  const googleIntegrationMirror = await integrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
    },
  });

  const outlookIntegrationMirror = await integrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum.OUTLOOK_CALENDAR,
    },
  });

  // Google mirror (if not already primary)
  if (googleIntegrationMirror &&
      !eventIdMap[IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]) {
    const { calendar } = await getCalendarClient(
      googleIntegrationMirror.app_type,
      googleIntegrationMirror.access_token,
      googleIntegrationMirror.refresh_token!,
      googleIntegrationMirror.expiry_date
    );

    const gResp = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `${guestName} - ${event.title}`,
        description: additionalInfo ? `${additionalInfo}\n\nJoin link: ${meetLink}` : `Join link: ${meetLink}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email: guestEmail }, { email: event.user.email }],
      },
    });
    eventIdMap[IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR] = gResp.data.id!;
  }

  // Outlook mirror (if not already primary)
  if (outlookIntegrationMirror &&
      !eventIdMap[IntegrationAppTypeEnum.OUTLOOK_CALENDAR]) {
    const tokenMirror = await validateMicrosoftToken(
      outlookIntegrationMirror.access_token,
      outlookIntegrationMirror.refresh_token ?? "",
      outlookIntegrationMirror.expiry_date
    );

    const oResp = await fetch("https://graph.microsoft.com/v1.0/me/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenMirror}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: `${guestName} - ${event.title}`,
        body: { contentType: "HTML", content: additionalInfo || "" },
        start: { dateTime: startTime.toISOString(), timeZone: "UTC" },
        end: { dateTime: endTime.toISOString(), timeZone: "UTC" },
        attendees: [
          { emailAddress: { address: guestEmail, name: guestName }, type: "required" },
          { emailAddress: { address: event.user.email, name: event.user.email }, type: "required" },
        ],
      }),
    });
    if (oResp.ok) {
      const oData: any = await oResp.json();
      eventIdMap[IntegrationAppTypeEnum.OUTLOOK_CALENDAR] = oData.id;
    }
  }

  const meeting = meetingRepository.create({
    event: { id: event.id },
    user: event.user,
    guestName,
    guestEmail,
    additionalInfo,
    startTime,
    endTime,
    meetLink: meetLink,
    calendarEventId: JSON.stringify(eventIdMap),
    calendarAppType: calendarAppType,
  });

  await meetingRepository.save(meeting);

  return {
    meetLink,
    meeting,
  };
};

export const cancelMeetingService = async (meetingId: string) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const integrationRepository = AppDataSource.getRepository(Integration);

  const meeting = await meetingRepository.findOne({
    where: { id: meetingId },
    relations: ["event", "event.user"],
  });
  if (!meeting) throw new NotFoundException("Meeting not found");

  try {
    const calendarIntegration = await integrationRepository.findOne({
      where: {
        app_type:
          IntegrationAppTypeEnum[
            meeting.calendarAppType as keyof typeof IntegrationAppTypeEnum
          ],
      },
    });

    if (calendarIntegration) {
      // Parse stored map (handles legacy string too)
      let storedIds: Record<string,string> = {};
      try {
        storedIds = JSON.parse(meeting.calendarEventId);
      } catch {
        storedIds[meeting.calendarAppType] = meeting.calendarEventId;
      }

      // Iterate over each stored event id and provider
      for (const [provider, evId] of Object.entries(storedIds)) {
        const appTypeEnum = provider as IntegrationAppTypeEnum;

        if (appTypeEnum === IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR) {
          const googleInt = await integrationRepository.findOne({
            where: { user: { id: meeting.event.user.id }, app_type: appTypeEnum },
          });
          if (googleInt) {
            const { calendar } = await getCalendarClient(
              googleInt.app_type,
              googleInt.access_token,
              googleInt.refresh_token!,
              googleInt.expiry_date
            );
            await calendar.events.delete({ calendarId: "primary", eventId: evId });
          }
        } else if (appTypeEnum === IntegrationAppTypeEnum.OUTLOOK_CALENDAR || appTypeEnum === IntegrationAppTypeEnum.MICROSOFT_TEAMS) {
          const msInt = await integrationRepository.findOne({
            where: { user: { id: meeting.event.user.id }, app_type: appTypeEnum },
          });
          if (msInt) {
            const tokenMs = await validateMicrosoftToken(
              msInt.access_token,
              msInt.refresh_token ?? "",
              msInt.expiry_date
            );
            await fetch(`https://graph.microsoft.com/v1.0/me/events/${evId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${tokenMs}` },
            });
          }
        } else if (appTypeEnum === IntegrationAppTypeEnum.ZOOM_MEETING) {
          const token = await validateZoomToken(
            calendarIntegration.access_token,
            calendarIntegration.refresh_token!,
            calendarIntegration.expiry_date
          );
          await fetch(`https://api.zoom.us/v2/meetings/${evId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        }
      }
    }
  } catch (error) {
    throw new BadRequestException("Failed to delete event from calendar");
  }

  meeting.status = MeetingStatus.CANCELLED;
  await meetingRepository.save(meeting);
  return { success: true };
};

async function getCalendarClient(
  appType: IntegrationAppTypeEnum,
  access_token: string,
  refresh_token: string,
  expiry_date: number | null
) {
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      const validToken = await validateGoogleToken(
        access_token,
        refresh_token,
        expiry_date
      );
      googleOAuth2Client.setCredentials({ access_token: validToken });
      const calendar = google.calendar({
        version: "v3",
        auth: googleOAuth2Client,
      });
      return {
        calendar,
        calendarType: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      };
    default:
      throw new BadRequestException(
        `Unsupported Calendar provider: ${appType}`
      );
  }
}
