import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail, IsString, Length } from "class-validator";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { FriendInvitation } from "./FriendInvitation";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @Column()
  @Length(4)
  password: string;

  @Column("jsonb", { nullable: true })
  friends: object[];

  @OneToMany(() => FriendInvitation, (friend) => friend.sender, {
    cascade: true,
    eager: true,
  })
  friendInvitationSent: FriendInvitation[];

  @OneToMany(() => FriendInvitation, (friend) => friend.receiver, {
    cascade: true,
    eager: true,
  })
  friendInvitationReceived: FriendInvitation[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  getSignedJwtToken() {
    return sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
