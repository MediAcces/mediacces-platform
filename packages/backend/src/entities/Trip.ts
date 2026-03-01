import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ServiceType, TripStatus, PaymentMode, PaymentStatus } from '../types/enums';
import { User } from './User';
import { Payment } from './Payment';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patient_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ nullable: true })
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column({ nullable: true })
  pharmacy_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'pharmacy_id' })
  pharmacy: User;

  @Column({ type: 'simple-enum', enum: ServiceType })
  service_type: ServiceType;

  @Column({ type: 'simple-enum', enum: TripStatus, default: TripStatus.PENDING })
  status: TripStatus;

  // Pickup location
  @Column({ length: 500 })
  pickup_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  pickup_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  pickup_longitude: number;

  // Dropoff location
  @Column({ length: 500 })
  dropoff_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  dropoff_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  dropoff_longitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  distance_km: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 0 })
  estimated_price: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 0 })
  total_price: number;

  @Column({ type: 'simple-enum', enum: PaymentMode, nullable: true })
  payment_mode: PaymentMode;

  @Column({ type: 'simple-enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  // For medication delivery
  @Column({ nullable: true, length: 500 })
  prescription_url: string;

  @Column({ nullable: true, type: 'text' })
  medication_list: string;

  // Timestamps for tracking
  @Column({ nullable: true })
  accepted_at: Date;

  @Column({ nullable: true })
  picked_up_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  cancelled_at: Date;

  @Column({ nullable: true, length: 255 })
  cancellation_reason: string;

  @OneToOne(() => Payment, (payment) => payment.trip)
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
