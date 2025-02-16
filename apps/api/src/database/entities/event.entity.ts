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
import { Booking } from "./booking.entity";
import { IsBoolean } from "class-validator";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  duration: number;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @Column({ default: true })
  @IsBoolean({ message: "isPrivate must be a boolean" })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
