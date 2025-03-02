import googleMeetLogo from "@/assets/google-meet.svg";
import googleCalendarLogo from "@/assets/google-calendar.svg";
import outlookCalendarLogo from "@/assets/microsoft-outlook.svg";
import microsoftTeamsLogo from "@/assets/microsoft-teams.svg";
import zoomLogo from "@/assets/zoom.svg";

export const IntegrationLogos: Record<IntegrationType, string> = {
  GOOGLE_CALENDAR: googleCalendarLogo,
  GOOGLE_MEET: googleMeetLogo,
  ZOOM_MEETING: zoomLogo,
  MICROSOFT_TEAMS: microsoftTeamsLogo,
  OUTLOOK_CALENDAR: outlookCalendarLogo,
};

export type IntegrationType =
  | "GOOGLE_MEET"
  | "ZOOM_MEETING"
  | "MICROSOFT_TEAMS"
  | "GOOGLE_CALENDAR"
  | "OUTLOOK_CALENDAR";

export type IntegrationTitleType =
  | "Google Meet"
  | "Zoom"
  | "Microsoft Teams"
  | "Outlook Calendar"
  | "Google Calendar";

// Integration Descriptions
export const IntegrationDescriptions: Record<IntegrationType, string> = {
  GOOGLE_MEET: "Include Google Meet details in your Meetly events.",
  ZOOM_MEETING: "Include Zoom details in your Meetly events.",
  MICROSOFT_TEAMS:
    "Microsoft Teams integration for video conferencing and collaboration.",
  GOOGLE_CALENDAR: "Google Calendar integration for scheduling and reminders.",
  OUTLOOK_CALENDAR:
    "Outlook Calendar integration for scheduling and reminders.",
};

export enum VideoConferencingPlatform {
  GOOGLE_MEET_AND_CALENDAR = "GOOGLE_MEET_AND_CALENDAR",
  ZOOM_MEETING = "ZOOM_MEETING",
  MICROSOFT_TEAMS = "MICROSOFT_TEAMS",
}

export const locationOptions = [
  {
    label: "Google Meet",
    value: VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR,
    logo: IntegrationLogos.GOOGLE_MEET,
    isAvailable: true,
  },
  {
    label: "Zoom",
    value: VideoConferencingPlatform.ZOOM_MEETING,
    logo: IntegrationLogos.ZOOM_MEETING,
    isAvailable: false,
  },
  {
    label: "Microsoft",
    value: VideoConferencingPlatform.MICROSOFT_TEAMS,
    logo: IntegrationLogos.MICROSOFT_TEAMS,
    isAvailable: false,
  },
];
