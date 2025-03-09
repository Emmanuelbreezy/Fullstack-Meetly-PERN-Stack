import { AppDataSource } from "../config/database.config";
import { CreateEventDTO, UserNameAndSlugDTO } from "../database/dto/event.dto";
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
      !Object.values(EventLocationEnumType)?.includes(eventData.locationType)
    ) {
      throw new BadRequestException("Invalid location type");
    }
    const slug = slugify(eventData.title);

    const event = eventRepository.create({
      ...eventData,
      slug,
      isPrivate: false,
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
    const user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.events", "event")
      .loadRelationCountAndMap("event._count.meetings", "event.meetings")
      .where("user.id = :userId", { userId })
      .orderBy("event.createdAt", "DESC")
      .getOne();

    if (!user) {
      throw new NotFoundException("User not found");
    }
    // const user = await userRepository.findOne({
    //   where: { id: userId },
    //   relations: ["events", "events.meetings"],
    //   order: { events: { createdAt: "DESC" } },
    // });

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

//We can use the querybuilder to
export const getPublicEventsByUsernameService = async (username: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")

      .leftJoinAndSelect(
        "user.events",
        "event",
        "event.isPrivate = :isPrivate",
        { isPrivate: false }
      )
      .where("user.username = :username", { username })
      .select(["user.id", "user.name", "user.imageUrl"]) // Select user fields
      .addSelect([
        "event.id",
        "event.title",
        "event.description",
        "event.slug",
        "event.duration",
      ])
      .orderBy("event.createdAt", "DESC")
      .getOne();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      user: {
        name: user.name,
        imageUrl: user.imageUrl,
      },
      events: user.events,
    };
  } catch (error) {
    throw new InternalServerException("Failed to fetch public events");
  }
};

export const getPublicEventByUsernameAndSlugService = async (
  userNameAndSlugDTO: UserNameAndSlugDTO
) => {
  const { username, slug } = userNameAndSlugDTO;
  try {
    const eventRepository = AppDataSource.getRepository(Event);
    // Fetch the event by username and slug
    const event = await eventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.user", "user") // Join the user table
      .where("user.username = :username", { username })
      .andWhere("event.slug = :slug", { slug })
      .andWhere("event.isPrivate = :isPrivate", { isPrivate: false }) // Only public events
      .select([
        "event.id",
        "event.title",
        "event.description",
        "event.duration",
        "event.slug",
        "event.isPrivate",
        "event.locationType",
      ])
      .addSelect(["user.id", "user.name", "user.imageUrl"]) // Select user fields
      .getOne();

    return event;
  } catch (error) {
    throw new InternalServerException("Failed to fetch event details");
  }
};

export const toggleEventPrivacyService = async (
  userId: string,
  eventId: string
) => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
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

export const deleteEventService = async (userId: string, eventId: string) => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);
    // Find the event by ID and user ID
    const event = await eventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }
    // Delete the event
    await eventRepository.remove(event);
    return { success: true };
  } catch (error) {
    throw new InternalServerException();
  }
};
