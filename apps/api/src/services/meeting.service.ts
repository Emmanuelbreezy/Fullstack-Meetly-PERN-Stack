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

export const getUserMeetingsService = async (
  userId: string,
  filter: MeetingFilterEnumType = MeetingFilterEnum.ALL
): Promise<Meeting[]> => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  // Define the query options
  const where: any = {
    user: { id: userId },
    status: MeetingStatus.SCHEDULED,
  };
  // Apply the filter
  if (filter === MeetingFilterEnum.UPCOMING) {
    where.startTime = MoreThan(new Date()); // Only upcoming meetings
  } else if (filter === MeetingFilterEnum.PAST) {
    where.startTime = LessThan(new Date()); // Only past meetings
  }
  // Fetch the meetings
  const meetings = await meetingRepository.find({
    where,
    relations: ["event"], // Include the event details
    order: { startTime: "ASC" }, // Sort by start time
  });

  if (!meetings || meetings.length === 0) {
    return [];
  }

  return meetings;
};

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
    const { calendar } = getCalendarClient(
      meetIntegration.app_type,
      meetIntegration.access_token
    );
    const meetResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${guestName} - ${event.title}`,
        description: additionalInfo,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
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
      // Step 3: Initialize the calendar client dynamically
      const { calendar, calendarType } = getCalendarClient(
        calendarIntegration.app_type,
        calendarIntegration.access_token
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
  // Step 5: Delete the meeting
  meeting.status = MeetingStatus.CANCELED;
  await meetingRepository.save(meeting);

  return { success: true };
};

function getCalendarClient(
  appType: IntegrationAppTypeEnum,
  accessToken: string
) {
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      return {
        calendar,
        calendarType: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      };
    default:
      throw new Error(`Unsupported calendar provider: ${appType}`);
  }
}
