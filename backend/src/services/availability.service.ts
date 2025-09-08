import { AvailabilityResponseType } from "../@types/availability.type";
import { AppDataSource } from "../config/database.config";
import { User } from "../database/entities/user.entity";
import { NotFoundException } from "../utils/app-error";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { Availability } from "../database/entities/availability.entity";
import { DayOfWeekEnum } from "../database/entities/day-availability";
import { Event } from "../database/entities/event.entity";
import { addDays, addMinutes, format, parseISO } from "date-fns";
import { Integration, IntegrationAppTypeEnum } from "../database/entities/integration.entity";
import { googleOAuth2Client } from "../config/oauth.config";
import { google } from "googleapis";
import { validateGoogleToken } from "./integration.service";
import { DayAvailability } from "../database/entities/day-availability";

export const getUserAvailabilityService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (!user.availability) {
    // create default availability 9-17 weekdays
    const availabilityRepo = AppDataSource.getRepository(Availability);
    const dayRepo = AppDataSource.getRepository(DayAvailability);

    const availability = availabilityRepo.create({
      timeGap: 30,
      days: Object.values(DayOfWeekEnum).map((day) => {
        return dayRepo.create({
          day,
          startTime: new Date(`2025-03-01T09:00:00Z`),
          endTime: new Date(`2025-03-01T17:00:00Z`),
          isAvailable: day !== DayOfWeekEnum.SUNDAY && day !== DayOfWeekEnum.SATURDAY,
        });
      }),
    });
    user.availability = availability;
    await AppDataSource.getRepository(User).save(user);
  }

  const availabilityData: AvailabilityResponseType = {
    timeGap: user.availability.timeGap,
    days: [],
  };

  user.availability.days.forEach((dayAvailability) => {
    availabilityData.days.push({
      day: dayAvailability.day,
      startTime: dayAvailability.startTime.toISOString().slice(11, 16),
      endTime: dayAvailability.endTime.toISOString().slice(11, 16),
      isAvailable: dayAvailability.isAvailable,
    });
  });

  return availabilityData;
};

export const updateAvailabilityService = async (
  userId: string,
  data: UpdateAvailabilityDto
) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  });

  if (!user) throw new NotFoundException("User not found");

  const dayAvailabilityData = data.days.map(
    ({ day, isAvailable, startTime, endTime }) => {
      const baseDate = new Date().toISOString().split("T")[0];
      return {
        day: day.toUpperCase() as DayOfWeekEnum,
        startTime: new Date(`${baseDate}T${startTime}:00Z`),
        endTime: new Date(`${baseDate}T${endTime}:00Z`),
        isAvailable,
      };
    }
  );

  if (user.availability) {
    await availabilityRepository.save({
      id: user.availability.id,
      timeGap: data.timeGap,
      days: dayAvailabilityData.map((day) => ({
        ...day,
        availability: { id: user.availability.id },
      })),
    });
  }

  return { sucess: true };
};

export const getAvailabilityForPublicEventService = async (eventId: string) => {
  const eventRepository = AppDataSource.getRepository(Event);

  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false },
    relations: [
      "user",
      "user.availability",
      "user.availability.days",
      "user.meetings",
    ],
  });

  if (!event || !event.user.availability) return [];

  const { availability, meetings } = event.user;

  const daysOfWeek = Object.values(DayOfWeekEnum);

  const availableDays = [];

  // Fetch Google integration (for free/busy)
  const integrationRepository = AppDataSource.getRepository(Integration);
  const googleIntegration = await integrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
    },
  });

  for (const dayOfWeek of daysOfWeek) {
    const nextDate = getNextDateForDay(dayOfWeek);
    //console.log(nextDate, dayOfWeek, "nextDate");

    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);
    if (dayAvailability) {
      const slots = dayAvailability.isAvailable
        ? generateAvailableTimeSlots(
            dayAvailability.startTime,
            dayAvailability.endTime,
            event.duration,
            meetings,
            format(nextDate, "yyyy-MM-dd"),
            availability.timeGap
          )
        : [];

      // Filter with Google busy times if integration exists
      let filteredSlots = slots;
      if (googleIntegration && slots.length) {
        const { calendar } = await getGoogleCalendarClient(googleIntegration);

        const dayStart = parseISO(`${format(nextDate, "yyyy-MM-dd")}T00:00:00Z`);
        const dayEnd = parseISO(`${format(nextDate, "yyyy-MM-dd")}T23:59:59Z`);

        const selectedIds =
          ((googleIntegration.metadata as any)?.selectedCalendarIds as
            | string[]
            | undefined) ?? ["primary"];

        const fb = await calendar.freebusy.query({
          requestBody: {
            timeMin: dayStart.toISOString(),
            timeMax: dayEnd.toISOString(),
            items: selectedIds.map((id) => ({ id })),
          },
        });

        const busyBlocks: { start: Date; end: Date }[] = [];
        Object.values(fb.data.calendars ?? {}).forEach((c) => {
          c.busy?.forEach((b) => {
            busyBlocks.push({ start: new Date(b.start!), end: new Date(b.end!) });
          });
        });

        filteredSlots = slots.filter((time) => {
          const slotStart = parseISO(`${format(nextDate, "yyyy-MM-dd")}T${time}:00`);
          const slotEnd = addMinutes(slotStart, event.duration);
          return !busyBlocks.some((b) => slotStart < b.end && slotEnd > b.start);
        });
      }

      availableDays.push({
        day: dayOfWeek,
        slots: filteredSlots,
        isAvailable: dayAvailability.isAvailable,
      });
    }
  }

  return availableDays;
};

function getNextDateForDay(dayOfWeek: string): Date {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const today = new Date();
  const todayDay = today.getDay();

  const targetDay = days.indexOf(dayOfWeek);

  //todayDay = 1// Monday
  //dayOfWeek  = 1 Monday
  //(1 - 1) = 0
  //-3 + 7 = 4
  // 4 % 7 = 4
  //result: Monday is in 0
  const daysUntilTarget = (targetDay - todayDay + 7) % 7;

  return addDays(today, daysUntilTarget);
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  meetings: { startTime: Date; endTime: Date }[],
  dateStr: string,
  timeGap: number = 30
) {
  const slots = [];

  let slotStartTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );

  let slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  const now = new Date();

  const isToday = format(now, "yyyy-MM-dd") === dateStr;

  while (slotStartTime < slotEndTime) {
    if (!isToday || slotStartTime >= now) {
      const slotEnd = new Date(slotStartTime.getTime() + duration * 60000);

      if (isSlotAvailable(slotStartTime, slotEnd, meetings)) {
        slots.push(format(slotStartTime, "HH:mm"));
      }
    }

    slotStartTime = addMinutes(slotStartTime, timeGap);
  }

  return slots;
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  meetings: { startTime: Date; endTime: Date }[]
): boolean {
  for (const meeting of meetings) {
    if (slotStart < meeting.endTime && slotEnd > meeting.startTime) {
      return false;
    }
  }
  return true;
}

async function getGoogleCalendarClient(integration: Integration) {
  const validToken = await validateGoogleToken(
    integration.access_token,
    integration.refresh_token!,
    integration.expiry_date
  );
  googleOAuth2Client.setCredentials({ access_token: validToken });
  const calendar = google.calendar({ version: "v3", auth: googleOAuth2Client });
  return { calendar };
}
