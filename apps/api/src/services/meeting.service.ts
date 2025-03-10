import { MoreThan, LessThan } from "typeorm";
import { google } from "googleapis";
import { AppDataSource } from "../config/database.config";
import { Meeting, MeetingStatus } from "../database/entities/meeting.entity";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
} from "../database/entities/integration.entity";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { CreateMeetingDTO } from "../database/dto/meeting.dto";
import {
  Event,
  EventLocationEnumType,
} from "../database/entities/event.entity";
import { validateGoogleToken } from "./integration.service";
import { googleOAuth2Client } from "../config/oauth.config";

export const getUserMeetingsService = async (
  userId: string,
  filter: MeetingFilterEnumType
): Promise<Meeting[]> => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const where: any = { user: { id: userId } };
  // Apply the filter
  if (filter === MeetingFilterEnum.UPCOMING) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date()); // Only upcoming meetings
  } else if (filter === MeetingFilterEnum.PAST) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = LessThan(new Date()); // Only past meetings
  } else if (filter === MeetingFilterEnum.CANCELLED) {
    where.status = MeetingStatus.CANCELLED; // Only canceled meetings
  } else {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date()); // Default to upcoming meetings
  }
  // Fetch the meetings
  const meetings = await meetingRepository.find({
    where,
    relations: ["event"], // Include the event details
    order: { startTime: "ASC" }, // Sort by start time
  });

  return meetings || []; // Return an empty array if no meetings are found
};

//***************  CreateMeetBookingForGuestService */
//***************  CreateMeetBookingForGuestService */
export const createMeetBookingForGuestService = async (
  bookingData: CreateMeetingDTO
) => {
  const { eventId, guestEmail, guestName, additionalInfo } = bookingData;
  const startTime = new Date(bookingData.startTime);
  const endTime = new Date(bookingData.endTime);

  const eventRepository = AppDataSource.getRepository(Event);
  const integrationRepository = AppDataSource.getRepository(Integration);
  const meetingRepository = AppDataSource.getRepository(Meeting);

  // Step 1: Fetch the event
  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false },
    relations: ["user"],
  });

  if (!event) throw new NotFoundException("Event not found");

  // Step 2: Check if the event.locationType is valid
  if (!Object.values(EventLocationEnumType).includes(event.locationType)) {
    throw new BadRequestException("Invalid location type");
  }
  // Step 3: Fetch the connected calendar integration
  const meetIntegration = await integrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum[event.locationType],
    },
  });

  if (!meetIntegration) {
    throw new BadRequestException("No video conferencing integration found");
  }

  // Step 5: Create the calendar event
  let meetLink: string = "";
  let calendarEventId: string = "";

  if (event.locationType === EventLocationEnumType.GOOGLE_MEET_AND_CALENDAR) {
    // Create Google Meet link
    const { calendar } = await getCalendarClient(
      meetIntegration.app_type,
      meetIntegration.access_token,
      meetIntegration.refresh_token,
      meetIntegration.expiry_date
    );
    const meetResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${guestName} - ${event.title}`,
        description: additionalInfo,
        start: { dateTime: startTime.toISOString() }, // UTC time
        end: { dateTime: endTime.toISOString() }, // UTC time
        attendees: [{ email: guestEmail }, { email: event.user.email }],
        conferenceData: {
          createRequest: { requestId: `${event.id}-${Date.now()}` },
        },
      },
    });

    meetLink = meetResponse.data.hangoutLink!;
    calendarEventId = meetResponse.data.id!;
  } else if (event.locationType === EventLocationEnumType.ZOOM_MEETING) {
  } else {
    throw new BadRequestException("Unsupported location type");
  }
  // Step 6: Save the meeting
  const meeting = meetingRepository.create({
    event: { id: event.id },
    user: event.user,
    guestName,
    guestEmail,
    additionalInfo,
    startTime,
    endTime,
    meetLink: meetLink,
    calendarEventId: calendarEventId,
  });
  await meetingRepository.save(meeting);

  return {
    meeting,
    meetLink,
  };
};

//***************  cancelMeetingService */
//***************  cancelMeetingService */

export const cancelMeetingService = async (meetingId: string) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const integrationRepository = AppDataSource.getRepository(Integration);
  // Step 1: Fetch the meeting
  const meeting = await meetingRepository.findOne({
    where: { id: meetingId },
    relations: ["event", "event.user"],
  });

  if (!meeting) {
    throw new NotFoundException("Meeting not found");
  }
  // Step 4: Delete the calendar event
  try {
    //the where clause in your code uses an array of conditions,
    //  which translates to an OR operation in TypeORM.
    const calendarIntegration = await integrationRepository.findOne({
      where: [
        {
          user: { id: meeting.event.user.id },
          category: IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
        },
        {
          user: { id: meeting.event.user.id },
          category: IntegrationCategoryEnum.CALENDAR,
        },
      ],
    });

    if (calendarIntegration) {
      // Initialize the calendar client dynamically
      const { calendar, calendarType } = await getCalendarClient(
        calendarIntegration.app_type,
        calendarIntegration.access_token,
        calendarIntegration.refresh_token,
        calendarIntegration.expiry_date
      );
      switch (calendarType) {
        case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
          await calendar.events.delete({
            calendarId: "primary",
            eventId: meeting.calendarEventId,
          });
          break;
        default:
          throw new Error(`Unsupported calendar provider: ${calendarType}`);
      }
    }
  } catch (error) {
    console.error("Failed to delete event from calendar:", error);
    throw new BadRequestException("Failed to delete event from calendar");
  }

  meeting.status = MeetingStatus.CANCELLED;
  await meetingRepository.save(meeting);

  return { success: true };
};

async function getCalendarClient(
  appType: IntegrationAppTypeEnum,
  access_token: string,
  refresh_token: string,
  expiry_date: number | null
) {
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      const validToken = await validateGoogleToken(
        access_token,
        refresh_token,
        expiry_date
      );
      googleOAuth2Client.setCredentials({ access_token: validToken });
      const calendar = google.calendar({
        version: "v3",
        auth: googleOAuth2Client,
      });
      return {
        calendar,
        calendarType: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      };
    default:
      throw new Error(`Unsupported calendar provider: ${appType}`);
  }
}
