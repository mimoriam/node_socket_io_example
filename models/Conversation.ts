import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("simple-array", { nullable: true })
  participantsId: string[];

  @ManyToMany(() => User, (participants) => participants.conversations)
  @JoinColumn({ name: "participantsId" })
  participants: User[];

  @Column("simple-array", { nullable: true })
  messagesId: string[];

  @ManyToMany(() => Message, (messages) => messages.conversations)
  @JoinTable()
  @JoinColumn({ name: "messagesId" })
  messages: Message[];
}
