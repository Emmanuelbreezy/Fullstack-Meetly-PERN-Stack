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
import { Meeting } from "./meeting.entity";
import { Availability } from "./availability.entity";
import { compareValue, hashValue } from "../../utils/bcrypt";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Integration } from "./integration.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  //cascade=true -> ensures related entities are automatically
  //  saved/updated/deleted.
  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
  })
  events: Event[];

  @OneToMany(() => Meeting, (meeting) => meeting.user, {
    cascade: true,
  })
  meetings: Meeting[];

  @OneToOne(() => Availability, (availability) => availability.user, {
    cascade: true,
  })
  @JoinColumn()
  availability: Availability;

  @OneToMany(() => Integration, (integration) => integration.user, {
    cascade: true,
  })
  integrations: Integration[];

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
