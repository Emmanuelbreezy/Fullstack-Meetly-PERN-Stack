import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Availability } from "./availability.entity";
import { DayOfWeek } from "../../enums/days-week.enum";

@Entity()
export class DayAvailability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Availability, (availability) => availability.days)
  availability: Availability;

  @Column({ type: "enum", enum: DayOfWeek })
  day: DayOfWeek;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
