import { IsString, IsNotEmpty, IsEmail, IsDateString } from "class-validator";

export class CreateMeetingDTO {
  @IsString()
  @IsNotEmpty()
  eventId: string; // Add eventId to the DTO

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @IsString()
  additionalInfo?: string;
}

export class MeetingIdDTO {
  @IsString()
  @IsNotEmpty()
  meetingId: string;
}
