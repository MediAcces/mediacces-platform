import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotificationType } from '../types/enums';
import { User } from './User';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'simple-enum', enum: NotificationType })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true, type: 'simple-json' })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  created_at: Date;
}
