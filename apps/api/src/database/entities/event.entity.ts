import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Meeting } from "./meeting.entity";
import { IntegrationAppTypeEnum } from "./integration.entity";

export enum EventLocationEnumType {
  GOOGLE_MEET = IntegrationAppTypeEnum.GOOGLE_MEET,
  ZOOM = IntegrationAppTypeEnum.ZOOM,
  MICROSOFT_TEAMS = IntegrationAppTypeEnum.MICROSOFT_TEAMS,
}

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  duration: number;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false, default: true })
  isPrivate: boolean;

  @Column({ type: "enum", enum: EventLocationEnumType })
  locationType: EventLocationEnumType;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
