import {
  Entity,
  OneToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Photo } from "./Photo";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({
    type: "text",
    nullable: false,
    default: "https://api.dicebear.com/avatar.svg",
  })
  avatar: string;

  @Column({ type: "json", default: () => "'[]'" })
  photos: Photo[];
}
