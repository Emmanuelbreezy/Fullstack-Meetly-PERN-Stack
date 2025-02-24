import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum IntegrationProviderEnum {
  GOOGLE = "GOOGLE",
  ZOOM = "ZOOM",
}

export enum IntegrationAppTypeEnum {
  GOOGLE_MEET_AND_CALENDAR = "GOOGLE_MEET_AND_CALENDAR",
  // GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
  // GOOGLE_MEET = "GOOGLE_MEET",
  ZOOM_MEETING = "ZOOM_MEETING",
  //OUTLOOK_CALENDAR = "OUTLOOK_CALENDAR",
}

export enum IntegrationCategoryEnum {
  VIDEO_CONFERENCING = "VIDEO_CONFERENCING",
  CALENDAR = "CALENDAR",
  CALENDAR_AND_VIDEO_CONFERENCING = "CALENDAR_AND_VIDEO_CONFERENCING",
}

interface GoogleMeetMetadata {
  email: string;
  scope: string;
}

interface GoogleCalendarMetadata extends GoogleMeetMetadata {}

type IntegrationMetadata = GoogleMeetMetadata | GoogleCalendarMetadata;

@Entity({ name: "integrations" })
export class Integration {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: IntegrationProviderEnum })
  provider: IntegrationProviderEnum;

  @Column({ type: "enum", enum: IntegrationCategoryEnum })
  category: IntegrationCategoryEnum;

  @Column({ type: "enum", enum: IntegrationAppTypeEnum })
  app_type: IntegrationAppTypeEnum;

  @Column()
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ type: "json" })
  metadata: IntegrationMetadata;

  @Column({ default: true })
  isConnected: boolean;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.integrations)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
