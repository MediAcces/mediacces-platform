import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentType, DocumentStatus } from '../types/enums';
import { User } from './User';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'simple-enum', enum: DocumentType })
  type: DocumentType;

  @Column({ length: 500 })
  file_url: string;

  @Column({ nullable: true, length: 255 })
  original_filename: string;

  @Column({ type: 'simple-enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  validation_status: DocumentStatus;

  @Column({ nullable: true, type: 'text' })
  rejection_reason: string;

  @Column({ nullable: true })
  validated_by: string;

  @Column({ nullable: true })
  validated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
