export type AvailabilityResponseType = {
  timeGap: number;
  days: {
    [day: string]: {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    };
  };
};
