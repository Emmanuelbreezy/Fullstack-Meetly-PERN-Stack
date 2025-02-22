import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { Availability } from "./availability.entity";

export enum DayOfWeekEnum {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

@Entity()
export class DayAvailability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Availability, (availability) => availability.days)
  availability: Availability;

  @Index()
  @Column({ type: "enum", enum: DayOfWeekEnum })
  day: DayOfWeekEnum;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
