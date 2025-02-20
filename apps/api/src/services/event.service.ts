import { AppDataSource } from "../config/database.config";
import { CreateEventDTO } from "../database/dto/event.dto";
import { Event } from "../database/entities/event.entity";
import { InternalServerException } from "../utils/app-error";

export const createEventService = async (
  userId: string,
  eventData: CreateEventDTO
) => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = eventRepository.create({
      ...eventData,
      user: { id: userId },
    });
    await eventRepository.save(event);
    return event;
  } catch (error) {
    throw new InternalServerException();
  }
};
