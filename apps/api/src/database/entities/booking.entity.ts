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

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  meetLink: string;

  @Column()
  googleEventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
