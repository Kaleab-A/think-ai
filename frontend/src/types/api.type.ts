import { IntegrationAppType, VideoConferencingPlatform } from "@/lib/types";

export type loginType = { email: string; password: string };
export type LoginResponseType = {
  message: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  accessToken: string;
  expiresAt: number;
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};

export type CreateEventPayloadType = {
  title: string;
  description: string;
  duration: number;
  locationType: VideoConferencingPlatform;
};

export interface UserType {
  name: string;
  imageUrl: string | null;
}
export interface EventType {
  id: string;
  title: string;
  description: string;
  duration: number;
  slug: string;
  isPrivate: boolean;
  locationType: VideoConferencingPlatform;
  createdAt: string;
  updatedAt: string;
  user: UserType;
  _count: number;
}

export interface ToggleEventVisibilityResponseType {
  message: string;
  event: EventType;
}

export interface UserEventListResponse {
  message: string;
  data: {
    events: EventType[];
    username: string;
  };
}

//***********Integration */
export interface IntegrationType {
  provider: "GOOGLE" | "ZOOM" | "MICROSOFT";
  title: string;
  app_type: IntegrationAppType;
  category: "VIDEO_CONFERENCING" | "CALENDAR";
  isConnected: boolean;
}

export interface GetAllIntegrationResponseType {
  message: string;
  integrations: IntegrationType[];
}

//************************* Availablity */
export interface DayAvailabilityType {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
export interface AvailabilityType {
  timeGap: number;
  days: DayAvailabilityType[];
}

export interface UserAvailabilityResponseType {
  message: string;
  availability: AvailabilityType;
}

//************************* Meetings */
type MeetingStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED";

export interface MeetingType {
  id: string;
  guestName: string;
  guestEmail: string;
  additionalInfo: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  calendarEventId: string;
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
  event: EventType;
}
export interface UserMeetingsResponseType {
  message: string;
  meetings: MeetingType[];
}

//************ALL PUBLIC API TYPES */

export interface PublicEventResponseType {
  message: string;
  user: UserType;
  events: EventType[];
}

export interface PublicSingleEventDetailResponseType {
  message: string;
  event: EventType;
}

export type DayOfWeekType =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

interface AvailabilitySlotType {
  day: DayOfWeekType;
  dateStr: string; // ISO date string (e.g., "2025-03-08")
  slots: string[]; // Array of time slots (e.g., ["10:00", "10:30"])
  isAvailable: boolean;
}

export interface PublicAvailabilityEventResponseType {
  message: string;
  data: AvailabilitySlotType[];
}

export interface CreateMeetingType {
  eventId: string;
  startTime: string;
  endTime: string;
  guestName: string;
  guestEmail: string;
  additionalInfo?: string;
}

export type PeriodType = "UPCOMING" | "PAST" | "CANCELLED";
