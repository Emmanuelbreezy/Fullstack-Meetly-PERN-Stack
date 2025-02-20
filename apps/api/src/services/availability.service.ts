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
      return null;
    }
    // Transform the availability data into the expected format
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
    const dayAvailabilityRepository =
      AppDataSource.getRepository(DayAvailability);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["availability"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Transform the availability data into the database format
    const availabilityData = Object.entries(data.days).flatMap(
      ([day, { isAvailable, startTime, endTime }]) => {
        if (isAvailable) {
          const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
          return [
            {
              day: day.toUpperCase(),
              startTime: new Date(`${baseDate}T${startTime}:00Z`),
              endTime: new Date(`${baseDate}T${endTime}:00Z`),
            },
          ];
        }
        return [];
      }
    );

    // Update or create the availability
    if (user.availability) {
      // Delete existing days and create new ones
      await dayAvailabilityRepository.delete({
        availability: { id: user.availability.id },
      });

      // Update the time gap
      await availabilityRepository.update(user.availability.id, {
        timeGap: data.timeGap,
      });

      const newDays = availabilityData.map((day) => ({
        ...day,
        day: day.day as DayOfWeekEnum,
        availability: { id: user.availability.id },
      }));
      await dayAvailabilityRepository.save(newDays);
    } else {
      // Create new availability
      const newAvailability = availabilityRepository.create({
        user: { id: user.id }, // Link to the user
        timeGap: data.timeGap,
      });

      const newDays = availabilityData.map((day) =>
        dayAvailabilityRepository.create({
          ...day,
          day: day.day as DayOfWeekEnum, // Cast to DayOfWeekEnum
          availability: newAvailability, // Link to the new availability
        })
      );
      // Assign the days to the new availability
      newAvailability.days = newDays;
      await availabilityRepository.save(newAvailability);
    }

    return user.availability;
  } catch (error) {
    throw new InternalServerException("Failed to fetch user availability");
  }
};
