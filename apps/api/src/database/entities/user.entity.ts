import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { Booking } from "./booking.entity";
import { Availability } from "./availability.entity";
import { compareValue, hashValue } from "../../utils/bcrypt";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column() // Add a password column
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToOne(() => Availability, (availability) => availability.user)
  @JoinColumn()
  availability: Availability;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashValue(this.password); // Hash with salt rounds = 10
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return compareValue(candidatePassword, this.password);
  }

  // The error occurs because TypeScript expects the Omit<User, "password">
  //  type to exclude only the password field,
  // but the omitPassword method is returning an object that
  //  also excludes the methods (hashPassword, comparePassword, omitPassword)
  // defined in the User class. This mismatch causes a TypeScript error.
  omitPassword(): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword as Omit<User, "password">;
  }
}
