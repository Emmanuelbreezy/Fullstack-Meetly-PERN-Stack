import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
} from "class-validator";
import { EventLocationEnumType } from "../entities/event.entity";

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @IsEnum(EventLocationEnumType)
  @IsNotEmpty()
  locationType: EventLocationEnumType;
}

export class EventIdDTO {
  //uuid v4
  @IsUUID(4, { message: "Invalid UUID format" })
  @IsNotEmpty()
  eventId: string;
}

export class UserNameDTO {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UserNameAndSlugDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
