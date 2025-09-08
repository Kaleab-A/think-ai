import { DayOfWeekType } from "@/types/api.type";

export const dayMapping: Record<DayOfWeekType, string> = {
  SUNDAY: "Sun",
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

export type Availability = {
  day: DayOfWeekType;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type WeeklyHoursFormData = {
  timeGap: number;
  availability: Availability[];
};

export const generateTimeSlots = (
  timeGap: number = 30,
  format: "12h" | "24h" = "24h"
) => {
  const slots = [];
  const totalMinutes = 24 * 60; // 24 hours in minutes

  for (let minutes = 0; minutes < totalMinutes; minutes += timeGap) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const time =
      format === "12h"
        ? `${String(hours % 12 || 12).padStart(2, "0")}:${String(mins).padStart(
            2,
            "0"
          )} ${hours < 12 ? "AM" : "PM"}`
        : `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

    slots.push(time);
  }

  return slots;
};

export const availabilityPlaceholder = [
  { day: "MONDAY", isAvailable: true, slots: [] },
  { day: "TUESDAY", isAvailable: true, slots: [] },
  {
    day: "WEDNESDAY",
    isAvailable: true,
    slots: [],
  },
  { day: "THURSDAY", isAvailable: true, slots: [] },
  { day: "FRIDAY", isAvailable: true, slots: [] },
  { day: "SATURDAY", isAvailable: false, slots: [] },
  { day: "SUNDAY", isAvailable: false, slots: [] },
];
