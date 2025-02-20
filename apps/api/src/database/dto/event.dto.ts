import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
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
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
