import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";

// booking not meetings

export enum MeetingStatus {
  SCHEDULED = "SCHEDULED",
  CANCELED = "CANCELED",
}
@Entity({ name: "meetings" })
export class Meeting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Event, (event) => event.meetings)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => User, (user) => user.meetings)
  user: User;

  @Column()
  guestName: string;

  @Column()
  guestEmail: string;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  meetLink: string;

  @Column()
  calendarEventId: string; //googleEventId

  @Column({
    type: "enum",
    enum: MeetingStatus,
    default: MeetingStatus.SCHEDULED,
  })
  status: MeetingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
