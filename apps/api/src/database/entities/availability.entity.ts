import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { DayAvailability } from "./day-availability.entity";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.availability)
  user: User;

  @OneToMany(
    () => DayAvailability,
    (dayAvailability) => dayAvailability.availability
  )
  days: DayAvailability[];

  @Column()
  timeGap: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
