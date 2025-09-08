import { title } from "process";
import { AppDataSource } from "../config/database.config";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity";
import { BadRequestException } from "../utils/app-error";
import { googleOAuth2Client } from "../config/oauth.config";
import { encodeState } from "../utils/helper";
import { google } from "googleapis";
import { ZOOM_OAUTH_CONFIG } from "../config/zoom.config";
import { MS_OAUTH_CONFIG } from "../config/microsoft.config";

const appTypeToProviderMap: Record<
  IntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationProviderEnum.MICROSOFT,
  [IntegrationAppTypeEnum.MICROSOFT_TEAMS]: IntegrationProviderEnum.MICROSOFT,
};

const appTypeToCategoryMap: Record<
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationCategoryEnum.CALENDAR,
  [IntegrationAppTypeEnum.MICROSOFT_TEAMS]: IntegrationCategoryEnum.VIDEO_CONFERENCING,
};

const appTypeToTitleMap: Record<IntegrationAppTypeEnum, string> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: "Google Meet & Calendar",
  [IntegrationAppTypeEnum.ZOOM_MEETING]: "Zoom",
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: "Outlook Calendar",
  [IntegrationAppTypeEnum.MICROSOFT_TEAMS]: "Microsoft Teams",
};

export const getUserIntegrationsService = async (userId: string) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const userIntegrations = await integrationRepository.find({
    where: { user: { id: userId } },
  });

  const connectedMap = new Map(
    userIntegrations.map((integration) => [integration.app_type, true])
  );

  return Object.values(IntegrationAppTypeEnum).flatMap((appType) => {
    return {
      provider: appTypeToProviderMap[appType],
      title: appTypeToTitleMap[appType],
      app_type: appType,
      category: appTypeToCategoryMap[appType],
      isConnected: connectedMap.has(appType) || false,
    };
  });
};

export const checkIntegrationService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const integration = await integrationRepository.findOne({
    where: { user: { id: userId }, app_type: appType },
  });

  if (!integration) {
    return false;
  }

  return true;
};

export const connectAppService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
) => {
  const state = encodeState({ userId, appType });

  let authUrl: string;

  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: true,
        scope: [
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly'
        ],
        state
      });
      break;
    case IntegrationAppTypeEnum.ZOOM_MEETING:
      authUrl = `${ZOOM_OAUTH_CONFIG.authUrl}?response_type=code&client_id=${ZOOM_OAUTH_CONFIG.clientId}&redirect_uri=${encodeURIComponent(ZOOM_OAUTH_CONFIG.redirectUri)}&state=${state}`;
      break;
    case IntegrationAppTypeEnum.OUTLOOK_CALENDAR:
    case IntegrationAppTypeEnum.MICROSOFT_TEAMS:
      authUrl = `${MS_OAUTH_CONFIG.authUrl}?client_id=${MS_OAUTH_CONFIG.clientId}` +
        `&response_type=code&redirect_uri=${encodeURIComponent(MS_OAUTH_CONFIG.redirectUri)}` +
        `&scope=${encodeURIComponent(MS_OAUTH_CONFIG.scope)}` +
        `&state=${state}`;
      break;
    default:
      throw new BadRequestException("Unsupported app type");
  }

  return { url: authUrl };
};

export const createIntegrationService = async (data: {
  userId: string;
  provider: IntegrationProviderEnum;
  category: IntegrationCategoryEnum;
  app_type: IntegrationAppTypeEnum;
  access_token: string;
  refresh_token?: string;
  expiry_date: number | null;
  metadata: any;
}) => {
  const integrationRepository = AppDataSource.getRepository(Integration);
  const existingIntegration = await integrationRepository.findOne({
    where: {
      userId: data.userId,
      app_type: data.app_type,
    },
  });

  if (existingIntegration) {
    throw new BadRequestException(`${data.app_type} already connected`);
  }

  const integration = integrationRepository.create({
    provider: data.provider,
    category: data.category,
    app_type: data.app_type,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expiry_date,
    metadata: data.metadata,
    userId: data.userId,
    isConnected: true,
  });

  await integrationRepository.save(integration);

  return integration;
};

export const validateGoogleToken = async (
  accessToken: string,
  refreshToken: string,
  expiryDate: number | null
) => {
  if (expiryDate === null || Date.now() >= expiryDate) {
    googleOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    const { credentials } = await googleOAuth2Client.refreshAccessToken();
    return credentials.access_token;
  }

  return accessToken;
};

export const validateZoomToken = async (
  accessToken: string,
  refreshToken: string,
  expiryDate: number | null
) => {
  if (expiryDate && Date.now() < expiryDate) return accessToken;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const resp = await fetch(ZOOM_OAUTH_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${ZOOM_OAUTH_CONFIG.clientId}:${ZOOM_OAUTH_CONFIG.clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!resp.ok) throw new Error("Failed to refresh Zoom token");
  const data = (await resp.json()) as any;
  return data.access_token as string;
};

export const validateMicrosoftToken = async (
  accessToken: string,
  refreshToken: string,
  expiryDate: number | null
) => {
  if (expiryDate && Date.now() < expiryDate) return accessToken;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", MS_OAUTH_CONFIG.clientId);
  params.append("client_secret", MS_OAUTH_CONFIG.clientSecret);
  params.append("redirect_uri", MS_OAUTH_CONFIG.redirectUri);

  const resp = await fetch(MS_OAUTH_CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!resp.ok) throw new Error("Failed to refresh Microsoft token");
  const data = (await resp.json()) as any;
  return data.access_token as string;
};

// ---------------- Calendar management ----------------

export const listCalendarsService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const integration = await integrationRepository.findOne({
    where: { user: { id: userId }, app_type: appType },
  });

  if (!integration) {
    throw new BadRequestException("Integration not found");
  }

  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR: {
      const { calendar } = await getCalendarClient(
        integration.app_type,
        integration.access_token,
        integration.refresh_token,
        integration.expiry_date
      );

      const calResp = await calendar.calendarList.list();
      const selectedIds =
        ((integration.metadata as any)?.selectedCalendarIds as
          | string[]
          | undefined) ?? ["primary"];

      const items = (calResp.data.items || []).map((c: any) => ({
        id: c.id!,
        summary: c.summary,
        selected: selectedIds.includes(c.id!),
      }));

      return items;
    }
    case IntegrationAppTypeEnum.ZOOM_MEETING: {
      // Zoom does not provide per-calendar busy information; return placeholder.
      return [];
    }
    case IntegrationAppTypeEnum.OUTLOOK_CALENDAR:
    case IntegrationAppTypeEnum.MICROSOFT_TEAMS: {
      // Obtain a valid access token (refresh if necessary)
      const validToken = await validateMicrosoftToken(
        integration.access_token,
        integration.refresh_token ?? "",
        integration.expiry_date
      );

      const resp = await fetch("https://graph.microsoft.com/v1.0/me/calendars", {
        headers: {
          Authorization: `Bearer ${validToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error("Failed to list Outlook calendars");
      }

      const data = (await resp.json()) as any;
      const apiItems = (data.value ?? []) as any[];

      // Previously selected IDs (or all if none saved yet)
      const selectedIds =
        ((integration.metadata as any)?.selectedCalendarIds as string[] | undefined) ?? apiItems.map((c) => c.id);

      const items = apiItems.map((c: any) => ({
        id: c.id,
        summary: c.name,
        selected: selectedIds.includes(c.id),
      }));

      return items;
    }
    default:
      throw new BadRequestException("Unsupported app type");
  }
};

export const saveSelectedCalendarsService = async (
  userId: string,
  appType: IntegrationAppTypeEnum,
  ids: string[]
) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const integration = await integrationRepository.findOne({
    where: { user: { id: userId }, app_type: appType },
  });

  if (!integration) throw new BadRequestException("Integration not found");

  // Simple write – we trust ids are valid (frontend fetched them via list)
  const metadata = {
    ...integration.metadata,
    selectedCalendarIds: ids,
  } as any;

  integration.metadata = metadata;
  await integrationRepository.save(integration);

  return { success: true };
};

// Helper to obtain a Google Calendar client with a valid token.
async function getCalendarClient(
  appType: IntegrationAppTypeEnum,
  access_token: string,
  refresh_token: string,
  expiry_date: number | null
) {
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR: {
      const validToken = await validateGoogleToken(
        access_token,
        refresh_token,
        expiry_date
      );
      googleOAuth2Client.setCredentials({ access_token: validToken });
      const calendar = google.calendar({ version: "v3", auth: googleOAuth2Client });
      return { calendar, calendarType: appType };
    }
    default:
      throw new BadRequestException(`Unsupported Calendar provider: ${appType}`);
  }
}
