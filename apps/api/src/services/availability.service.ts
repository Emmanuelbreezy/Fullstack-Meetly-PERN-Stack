import { format, addMinutes, parseISO, addDays } from "date-fns";
import { AvailabilityResponseType } from "../@types/availability.type";
import { AppDataSource } from "../config/database.config";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { Availability } from "../database/entities/availability.entity";
import { DayOfWeekEnum } from "../database/entities/day-availability.entity";
import { User } from "../database/entities/user.entity";
import { InternalServerException, NotFoundException } from "../utils/app-error";
import { Event } from "../database/entities/event.entity";
// const DEFAULT_START_TIME = "09:00";// const DEFAULT_END_TIME = "17:00";

export const getUserAvailabilityService = async (
  userId: string
): Promise<any> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["availability", "availability.days"],
    });
    if (!user || !user.availability) {
      throw new NotFoundException("User not found or avaibility");
    }
    // Transform the availability data into the expected format
    //AvailabilityResponseType  inside @types/
    const availabilityData: AvailabilityResponseType = {
      timeGap: user.availability.timeGap,
      days: [], // Initialize as an empty array
    };

    // Populate the days array with user's availability data
    user.availability.days.forEach((dayAvailability) => {
      availabilityData.days.push({
        day: dayAvailability.day,
        startTime: dayAvailability.startTime.toISOString().slice(11, 16),
        endTime: dayAvailability.endTime.toISOString().slice(11, 16),
        isAvailable: dayAvailability.isAvailable, // Use isAvailable from the entity
      });
    });
    return availabilityData;
  } catch (error) {
    throw new InternalServerException("Failed to fetch user availability");
  }
};

export const updateAvailabilityService = async (
  userId: string,
  data: UpdateAvailabilityDto
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const availabilityRepository = AppDataSource.getRepository(Availability);

    // Find the user with their availability and days
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["availability", "availability.days"],
    });
    if (!user) throw new NotFoundException("User not found");

    // Transform the availability data into the database format
    const availabilityData = data.days.map(
      ({ day, isAvailable, startTime, endTime }) => {
        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        return {
          day: day.toUpperCase() as DayOfWeekEnum,
          startTime: new Date(`${baseDate}T${startTime}:00Z`),
          endTime: new Date(`${baseDate}T${endTime}:00Z`),
          isAvailable,
        };
      }
    );

    // Update or create the availability
    if (user.availability) {
      // Update the time gap and days
      await availabilityRepository.save({
        id: user.availability.id,
        timeGap: data.timeGap,
        days: availabilityData.map((day) => ({
          ...day,
          availability: { id: user.availability.id },
        })),
      });
    }
    // else {
    //   // Create new availability
    //   const newAvailability = availabilityRepository.create({
    //     user: { id: user.id },
    //     timeGap: data.timeGap,
    //     days: availabilityData,
    //   });

    //   await availabilityRepository.save(newAvailability);
    // }
    return { success: true };
  } catch (error) {
    throw new InternalServerException("Failed to update availability");
  }
};

// For Public Event -> Guest user
export const getAvailabilityForPublicEventService = async (eventId: string) => {
  try {
    // Step 1: Get the Event Repository
    const eventRepository = AppDataSource.getRepository(Event);

    // Step 2: Fetch the Event with Related Data
    const event = await eventRepository.findOne({
      where: { id: eventId, isPrivate: false }, // Find the event by its ID
      relations: [
        "user", // Include the user who created the event
        "user.availability",
        "user.availability.days",
        "user.meetings",
      ],
    });

    // Step 3: Check if the Event or User's Availability Exists
    if (!event || !event.user.availability) {
      return [];
    }

    // Get the user's availability settings and their existing meetings
    const { availability, meetings } = event.user;

    // Step 4: Define the Days of the Week
    const daysOfWeek = Object.values(DayOfWeekEnum);
    // Step 5: Initialize an Array to Store Available Days
    const availableDays = [];

    // Step 6: Loop Through Each Day of the Week
    for (const dayOfWeek of daysOfWeek) {
      // Step 7: Find the User's Availability for This Day
      const dayAvailability = availability.days.find(
        (d) => d.day === dayOfWeek
      );

      // Step 8: If the User Is Available on This Day, Calculate Available Slots
      if (dayAvailability) {
        // Step 9: Get the Next Occurrence of This Day
        const nextDate = getNextDateForDay(dayOfWeek);

        // Step 10: Generate Available Time Slots for This Day
        const slots = dayAvailability.isAvailable
          ? generateAvailableTimeSlots(
              dayAvailability.startTime, // User's start time for the day
              dayAvailability.endTime, // User's end time for the day
              event.duration, // Duration of the event in minutes
              meetings, // User's existing meetings
              format(nextDate, "yyyy-MM-dd"), // The specific date for this day
              availability.timeGap // Time gap between slots
            )
          : []; // Return empty slots if the day is unavailable

        // Step 10: Add the Day and Available Slots to the Results
        availableDays.push({
          day: dayOfWeek,
          dateStr: format(new Date(), "yyyy-MM-dd"), // Placeholder date, not used
          slots,
          isAvailable: dayAvailability.isAvailable,
        });
      }
    }

    // Step 12: Return the Available Days and Slots
    return availableDays;
  } catch (error) {
    // Step 13: Handle Errors
    throw new InternalServerException("Failed to fetch event availability");
  }
};

function getNextDateForDay(dayOfWeek: string): Date {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = days.indexOf(dayOfWeek);

  // Calculate the next occurrence of the target day
  const daysUntilTarget = (targetDay - todayDay + 7) % 7;
  return addDays(today, daysUntilTarget);
}

function generateAvailableTimeSlots(
  startTime: Date, // The start time of the user's availability for the day
  endTime: Date, // The end time of the user's availability for the day
  duration: number, // The duration of the event in minutes
  meetings: { startTime: Date; endTime: Date }[], // The user's existing meetings for the day
  dateStr: string,
  timeGap: number = 30 // The time gap (in minutes) between slots. Defaults to 30.
) {
  // Step 1: Initialize an array to store the available time slots
  const slots = [];

  // Step 2: Parse the start and end times for the day
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // Step 3: Get the current system time
  const now = new Date();

  // Step 4: Check if the date is today
  const isToday = format(now, "yyyy-MM-dd") === dateStr;

  // Step 5: Loop through the time range to generate available slots
  while (currentTime < slotEndTime) {
    // Step 6: Skip slots that are in the past (only for today)
    if (!isToday || currentTime >= now) {
      // Calculate the end time of the current slot by adding the duration to currentTime
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      // Step 7: Check if the current slot is available
      if (isSlotAvailable(currentTime, slotEnd, meetings)) {
        // Step 8: If the slot is available, add it to the slots array
        slots.push(format(currentTime, "HH:mm"));
      }
    }

    // Step 9: Move to the next slot by adding the timeGap to currentTime
    currentTime = addMinutes(currentTime, timeGap);
  }

  // Step 10: Return the array of available time slots
  return slots;
}

function isSlotAvailable(
  currentTime: Date,
  slotEnd: Date,
  meetings: { startTime: Date; endTime: Date }[]
): boolean {
  return !meetings.some((meeting) => {
    const meetingStart = meeting.startTime;
    const meetingEnd = meeting.endTime;
    return (
      (currentTime >= meetingStart && currentTime < meetingEnd) || // Slot starts during a meeting
      (slotEnd > meetingStart && slotEnd <= meetingEnd) || // Slot ends during a meeting
      (currentTime <= meetingStart && slotEnd >= meetingEnd) // Slot completely overlaps a meeting
    );
  });
}

//OLD CODE FORMAT  MANUAL -> WITHOUT Cascade
// if (user.availability) {
//   // Update the time gap
//   await availabilityRepository.update(user.availability.id, {
//     timeGap: data.timeGap,
//   });

//   // Delete existing days and create new ones in a single transaction
//   await AppDataSource.transaction(async (transactionalEntityManager) => {
//     await transactionalEntityManager.delete(DayAvailability, {
//       availability: { id: user.availability.id },
//     });
//     // new days added
//     const newDays = availabilityData.map((day) =>
//       transactionalEntityManager.create(DayAvailability, {
//         ...day,
//         availability: { id: user.availability.id },
//       })
//     );
//     await transactionalEntityManager.save(newDays);
//   });
// } else {
//   const newAvailability = availabilityRepository.create({
//     user: { id: user.id },
//     timeGap: data.timeGap,
//     days: availabilityData.map((day) =>
//       dayAvailabilityRepository.create(day)
//     ),
//   });

//   await availabilityRepository.save(newAvailability);
// }
