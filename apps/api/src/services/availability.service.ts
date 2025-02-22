import { DeepPartial } from "typeorm";
import { AvailabilityResponseType } from "../@types/availability.type";
import { AppDataSource } from "../config/database.config";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { Availability } from "../database/entities/availability.entity";
import {
  DayAvailability,
  DayOfWeekEnum,
} from "../database/entities/day-availability.entity";
import { User } from "../database/entities/user.entity";
import { InternalServerException, NotFoundException } from "../utils/app-error";

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

export const getUserAvailabilityService = async (
  userId: string
): Promise<any> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["availability", "availability.days"],
    });
    // If user or availability doesn't exist, return null
    if (!user || !user.availability) {
      throw new NotFoundException("User not found or avaibility");
    }
    // Transform the availability data into the expected format
    //AvailabilityResponseType  inside @types/
    const availabilityData: AvailabilityResponseType = {
      timeGap: user.availability.timeGap,
      days: {},
    };
    // Map each day to its availability
    Object.values(DayOfWeekEnum).forEach((day) => {
      const dayAvailability = user.availability.days.find(
        (d) => d.day === day.toUpperCase()
      );
      availabilityData.days[day] = {
        startTime: dayAvailability
          ? dayAvailability.startTime.toISOString().slice(11, 16) // Extract HH:MM
          : DEFAULT_START_TIME,
        endTime: dayAvailability
          ? dayAvailability.endTime.toISOString().slice(11, 16) // Extract HH:MM
          : DEFAULT_END_TIME,
        isAvailable: !!dayAvailability,
      };
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
    //Object.entries  will convert into data.days  ->  [key, value] pairs.
    // [["monday", { isAvailable: true, startTime: "09:00", endTime: "17:00" }]],

    //flatMap -> It flattens the arrays into a single array.
    // and it ignore the empty array
    const availabilityData = Object.entries(data.days).flatMap(
      ([day, { isAvailable, startTime, endTime }]) => {
        if (isAvailable) {
          // Validate the day
          const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
          return [
            {
              day: day.toUpperCase() as DayOfWeekEnum,
              startTime: new Date(`${baseDate}T${startTime}:00Z`),
              endTime: new Date(`${baseDate}T${endTime}:00Z`),
            },
          ];
        }
        return []; //If false, it returns an empty array ([]),
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
