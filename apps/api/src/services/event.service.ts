import { AppDataSource } from "../config/database.config";
import { CreateEventDTO, EventIdDTO } from "../database/dto/event.dto";
import {
  Event,
  EventLocationEnumType,
} from "../database/entities/event.entity";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../utils/app-error";
import { slugify } from "../utils/helper";

export const createEventService = async (
  userId: string,
  eventData: CreateEventDTO
) => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);

    if (
      !Object.values(EventLocationEnumType).includes(eventData.locationType)
    ) {
      throw new BadRequestException("Invalid location type");
    }
    const slug = slugify(eventData.title);

    const event = eventRepository.create({
      ...eventData,
      slug,
      user: { id: userId },
    });
    await eventRepository.save(event);
    return event;
  } catch (error) {
    throw new InternalServerException();
  }
};

export const toggleEventPrivacyService = async (
  userId: string,
  eventIdDTO: EventIdDTO
) => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOne({
      where: { id: eventIdDTO.eventId, user: { id: userId } },
    });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    event.isPrivate = !event.isPrivate;
    await eventRepository.save(event);

    return event;
  } catch (error) {
    throw new InternalServerException();
  }
};
