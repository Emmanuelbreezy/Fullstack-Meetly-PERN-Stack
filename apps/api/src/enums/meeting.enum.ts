export const MeetingFilterEnum = {
  UPCOMING: "upcoming",
  PAST: "past",
  ALL: "all",
} as const;

export type MeetingFilterEnumType =
  (typeof MeetingFilterEnum)[keyof typeof MeetingFilterEnum];
