import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentStatus } from '../types/enums';
import { Trip } from './Trip';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trip_id: string;

  @OneToOne(() => Trip, (trip) => trip.payment)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  commission: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15 })
  commission_rate: number;

  @Column({ nullable: true, length: 255 })
  payment_reference: string;

  @Column({ nullable: true, length: 100 })
  payment_provider: string;

  @Column({ type: 'simple-enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
