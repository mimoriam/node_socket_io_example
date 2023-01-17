import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class FriendInvitation {
  @PrimaryGeneratedColumn()
  id: string;

  // Explicit columns:
  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @ManyToOne(() => User, (user) => user.friendInvitationSent)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @ManyToOne(() => User, (user) => user.friendInvitationReceived)
  @JoinColumn({ name: "receiverId" })
  receiver: User;
}
