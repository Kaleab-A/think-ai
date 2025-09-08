export const MeetingFilterEnum = {
  UPCOMING: "UPCOMING",
  PAST: "PAST",
  CANCELLED: "CANCELLED",
} as const;

export type MeetingFilterEnumType =
  (typeof MeetingFilterEnum)[keyof typeof MeetingFilterEnum];
