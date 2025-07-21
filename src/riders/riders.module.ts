// backend/src/riders/riders.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidersController } from './riders.controller';
import { RidesService } from '../rides/rides.service';
import { UsersService } from '../users/users.service';
import { Ride } from '../rides/ride.entity';
import { User } from '../users/user.entity';
import { RideGateway } from '../gateway/ride.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, User])],
  controllers: [RidersController],
  providers: [RidesService, UsersService, RideGateway],
})
export class RidersModule {}