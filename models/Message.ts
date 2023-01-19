import {
  Column,
  CreateDateColumn,
  Entity, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import {Conversation} from "./Conversation";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.messageAuthor)
  author: User;

  @Column()
  content: string;

  @Column()
  type: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToMany(() => Conversation, (conversations) => conversations.messages)
  conversations: Conversation[]
}
