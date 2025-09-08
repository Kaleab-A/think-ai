import { format, addMinutes, parseISO, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";

//************Format Selected Date & slot time to a human readable format */
//Wednesday, March 12, 2025, 10:00 – 10:15
export const formatSelectedSlot = (
  slot: string | null,
  duration: number,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  if (!slot) return null;
  // Decode the slot
  const decodedSlot = decodeURIComponent(slot);
  const startTime = parseISO(decodedSlot);
  // Convert the start time to the user's timezone
  const zonedStartTime = toZonedTime(startTime, timezone);
  // Calculate the end time using the duration
  const zonedEndTime = addMinutes(zonedStartTime, duration);

  // Format the date
  const formattedDate = format(zonedStartTime, "EEEE, MMMM d, yyyy");

  // Format the time based on `hourType`
  const timeFormat = hourType === "12h" ? "h:mm a" : "HH:mm";
  const formattedTime = `${format(zonedStartTime, timeFormat)} – ${format(
    zonedEndTime,
    timeFormat
  )}`;

  return `${formattedDate}, ${formattedTime}`;
};

//************Format Slot to timeZone and return in 24 or 12 hours */
export const formatSlot = (
  slot: string,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  const parsedTime = parse(slot, "HH:mm", new Date()); // Parse the slot time (e.g., "14:00")
  const zonedTime = toZonedTime(parsedTime, timezone); // Convert to the user's timezone
  return hourType === "12h"
    ? format(zonedTime, "h:mm a") // 12-hour format (e.g., "2:00 PM")
    : format(zonedTime, "HH:mm"); // 24-hour format (e.g., "14:00")
};

//************ Decode the Selected Time Slot and return it
//  to the slot format plsu hourType */
export const decodeSlot = (
  encodedSlot: string | null,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  if (!encodedSlot) return null;
  const decodedSlot = decodeURIComponent(encodedSlot);
  const slotDate = parseISO(decodedSlot);
  const zonedSlotDate = toZonedTime(slotDate, timezone);
  return hourType === "12h"
    ? format(zonedSlotDate, "h:mm a") // 12-hour format
    : format(zonedSlotDate, "HH:mm"); // 24-hour format
};
