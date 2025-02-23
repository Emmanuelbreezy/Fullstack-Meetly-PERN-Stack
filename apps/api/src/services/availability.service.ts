import {
  startOfDay,
  addDays,
  format,
  isBefore,
  addMinutes,
  parseISO,
  endOfMonth,
  startOfMonth,
} from "date-fns";
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
      days: {},
    };
    user.availability.days.forEach((dayAvailability) => {
      availabilityData.days[dayAvailability.day] = {
        startTime: dayAvailability.startTime.toISOString().slice(11, 16), // Extract HH:MM
        endTime: dayAvailability.endTime.toISOString().slice(11, 16), // Extract HH:MM
        isAvailable: dayAvailability.isAvailable, // Use isAvailable from the entity
      };
    });
    // Map each day to its availability
    // Object.values(DayOfWeekEnum).forEach((day) => {
    //   const dayAvailability = user.availability.days.find(
    //     (d) => d.day === day.toUpperCase()
    //   );
    //   availabilityData.days[day] = {
    //     startTime: dayAvailability
    //       ? dayAvailability.startTime.toISOString().slice(11, 16) // Extract HH:MM
    //       : DEFAULT_START_TIME,
    //     endTime: dayAvailability
    //       ? dayAvailability.endTime.toISOString().slice(11, 16) // Extract HH:MM
    //       : DEFAULT_END_TIME,
    //     isAvailable: dayAvailability ? dayAvailability.isAvailable : false,
    //   };
    // });
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
    //Object.entries  will convert into data.days  ->  [key, value] pairs.
    // [["monday", { isAvailable: true, startTime: "09:00", endTime: "17:00" }]],
    //flatMap -> It flattens the arrays into a single array.
    const availabilityData = Object.entries(data.days).flatMap(
      ([day, { isAvailable, startTime, endTime }]) => {
        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        return [
          {
            day: day.toUpperCase() as DayOfWeekEnum,
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
            isAvailable,
          },
        ];
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
    } else {
      // Create new availability
      const newAvailability = availabilityRepository.create({
        user: { id: user.id },
        timeGap: data.timeGap,
        days: availabilityData,
      });

      await availabilityRepository.save(newAvailability);
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

    // Return the updated user
    return { success: true };
  } catch (error) {
    console.error("Error in updateAvailabilityService:", error);
    throw new InternalServerException("Failed to update availability");
  }
};

//For Public Event -> Guest user
export const getAvailabilityForPublicEventService = async (eventId: string) => {
  try {
    // Step 1: Get the Event Repository
    const eventRepository = AppDataSource.getRepository(Event);

    // Step 2: Fetch the Event with Related Data
    // We need the event, the user who created it, the user's availability,
    //  and their meetings
    const event = await eventRepository.findOne({
      where: { id: eventId }, // Find the event by its ID
      relations: [
        "user", // Include the user who created the event
        "user.availability",
        "user.availability.days",
        "user.meetings",
      ],
    });

    // Step 3: Check if the Event or User's Availability Exists
    // If the event or the user's availability is not found,
    // return an empty array
    if (!event || !event.user.availability) {
      return [];
    }

    // Get the user's availability settings and
    // their existing meetings
    const { availability, meetings } = event.user;

    // Step 5: Define the Date Range
    // We'll calculate availability for the next 30 days
    // const startDate = startOfDay(new Date()); // Start from today
    // const endDate = addDays(startDate, 30); // End 30 days from today
    const startDate = startOfMonth(new Date()); // First day of the month
    const endDate = endOfMonth(new Date()); // Last day of the month

    // Step 6: Initialize an Array to Store Available Dates
    const availableDates = [];

    // Step 7: Loop Through Each Day in the Date Range
    // ->addDays(date, 1)   add plus 1 to day
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      // Step 8: Get the Day of the Week (e.g., "MONDAY")
      const dayOfWeek = format(date, "EEEE").toUpperCase();

      // Step 9: Find the User's Availability for This Day
      const dayAvailability = availability.days.find(
        (d) => d.day === dayOfWeek
      );

      // Step 10: If the User Is Available on This Day,
      // Calculate Available Slots
      if (dayAvailability && dayAvailability.isAvailable) {
        // Step 11: Format the Date as "yyyy-MM-dd"
        const dateStr = format(date, "yyyy-MM-dd");

        // Step 12: Generate Available Time Slots for This Day
        const slots = generateAvailableTimeSlots(
          dayAvailability.startTime, // User's start time for the day
          dayAvailability.endTime, // User's end time for the day
          event.duration, // Duration of the event in minutes
          meetings, // User's existing meetings
          dateStr, // The current date
          availability.timeGap // Time gap between slots
        );

        // Step 13: Add the Date and Available Slots to the Results
        availableDates.push({
          date: dateStr,
          slots,
        });
      }
    }

    // Step 14: Return the Available Dates and Slots
    return availableDates;
  } catch (error) {
    // Step 15: Handle Errors
    // If something goes wrong, throw an internal server error
    throw new InternalServerException("Failed to fetch event availability");
  }
};

function generateAvailableTimeSlots(
  startTime: Date, // The start time of the user's availability for the day
  endTime: Date, // The end time of the user's availability for the day
  duration: number, // The duration of the event in minutes
  meetings: { startTime: Date; endTime: Date }[], // The user's existing meetings for the day
  dateStr: string, // The date in "yyyy-MM-dd" format (e.g., "2023-10-25")
  timeGap: number = 0 // The time gap (in minutes) between slots. Defaults to 0.
) {
  // Step 1: Initialize an array to store the available time slots
  const slots = [];

  // Step 2: Parse the start and end times for the day
  // Combine the date (dateStr) with the time (from startTime and endTime)
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // If the date is today, start from the next available slot
  // after the current time
  const now = new Date();
  if (format(now, "yyyy-MM-dd") === dateStr) {
    // If the currentTime is before the current time, add the timeGap
    // to the current time
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  // Step 4: Loop through the time range to generate available slots
  while (currentTime < slotEndTime) {
    // Calculate the end time of the current slot by adding the
    // duration to currentTime
    //duration * 60000 convert the duration(in min) into milliseconds.
    // convert it to date after the addition
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    // Step 5: Check if the current slot is available
    // A slot is available if it does not overlap with
    // any existing meetings
    if (isSlotAvailable(currentTime, slotEnd, meetings)) {
      // Step 6: If the slot is available, add it to the slots array
      // and Format the time as "HH:mm" (e.g., "09:00")
      slots.push(format(currentTime, "HH:mm"));
    }
    // Step 7: Move to the next slot by setting currentTime to the end of the current slot
    currentTime = slotEnd;
  }

  // Step 8: Return the array of available time slots
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
