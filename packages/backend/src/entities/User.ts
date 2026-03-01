import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../types/enums';
import { Vehicle } from './Vehicle';
import { Document } from './Document';
import { Notification } from './Notification';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true, nullable: true, length: 255 })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ default: false })
  is_validated: boolean;

  @Column({ default: false })
  is_phone_verified: boolean;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  // Optional medical info for patients
  @Column({ nullable: true, length: 10 })
  blood_group: string;

  @Column({ nullable: true, type: 'text' })
  allergies: string;

  @Column({ nullable: true, length: 255 })
  treating_doctor: string;

  // For establishments
  @Column({ nullable: true, length: 255 })
  establishment_name: string;

  @Column({ nullable: true, length: 255 })
  licence_number: string;

  @Column({ nullable: true, length: 500 })
  address: string;

  // OTP fields
  @Column({ nullable: true, length: 6 })
  otp_code: string;

  @Column({ nullable: true })
  otp_expires_at: Date;

  // Provider-specific: online status
  @Column({ default: false })
  is_online: boolean;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  current_latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  current_longitude: number;

  @Column({ nullable: true, type: 'int' })
  action_radius_km: number;

  @Column({ nullable: true, length: 500 })
  profile_photo_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles: Vehicle[];

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
