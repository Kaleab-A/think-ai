export type AvailabilityResponseType = {
  timeGap: number;
  days: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
};
