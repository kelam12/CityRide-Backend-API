import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.ridesAsRider)
  rider!: User;

  @ManyToOne(() => User, (user) => user.ridesAsDriver, { nullable: true })
  driver!: User;

  @Column()
  pickupLocation!: string;

  @Column()
  dropoffLocation!: string;

  @Column({ type: 'float', nullable: true })
  lat!: number;

  @Column({ type: 'float', nullable: true })
  lng!: number;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  requestedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}