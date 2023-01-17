import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class FriendInvitation {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.friendInvitations)
  @JoinColumn({ name: "sender" })
  sender: User;

  @Column()
  receiver: string;
}
