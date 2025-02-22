import { AppDataSource } from "../config/database.config";
import { CreateEventDTO, EventIdDTO } from "../database/dto/event.dto";
import {
  Event,
  EventLocationEnumType,
} from "../database/entities/event.entity";
import { User } from "../database/entities/user.entity";
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

export const getUserEventsService = async (userId: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // const user = await userRepository.findOne({
    //   where: { id: userId },
    //   relations: ["events", "events.meetings"],
    //   order: { events: { createdAt: "DESC" } },
    // });

    const user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.events", "event")
      .leftJoinAndSelect("event.meetings", "meeting")
      .loadRelationCountAndMap("event.count.meetings", "event.meetings")
      .where("user.id = :userId", { userId })
      .orderBy("event.createdAt", "DESC")
      .getOne();

    if (!user) {
      throw new NotFoundException("User not found");
    }
    // Map events to include the count of meetings
    // const eventsWithCount = user.events.map((event) => ({
    //   ...event,
    //   _count: {
    //     meetings: event.meetings.length, // Count of related meetings
    //   },
    // }));

    return {
      events: user.events,
      username: user.username,
    };
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
