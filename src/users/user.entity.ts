// backend/src/users/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ride } from '../rides/ride.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  phone!: string;

  @Column()
  password!: string;

  @Column()
  role!: 'rider' | 'driver';

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Ride, (ride) => ride.rider)
  ridesAsRider!: Ride[];

  @OneToMany(() => Ride, (ride) => ride.driver)
  ridesAsDriver!: Ride[];
}