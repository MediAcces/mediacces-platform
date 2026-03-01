import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VehicleType } from '../types/enums';
import { User } from './User';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @Column({ type: 'simple-enum', enum: VehicleType })
  type: VehicleType;

  @Column({ nullable: true, length: 20 })
  plate_number: string;

  @Column({ nullable: true, length: 100 })
  brand: string;

  @Column({ nullable: true, length: 100 })
  model: string;

  @Column({ nullable: true, type: 'int' })
  year: number;

  @Column({ nullable: true, length: 50 })
  color: string;

  // Ambulance-specific
  @Column({ nullable: true, length: 100 })
  ambulance_certification: string;

  // Courier-specific
  @Column({ nullable: true, type: 'text' })
  equipment: string; // e.g., "sac isotherme, caisse médicale"

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
