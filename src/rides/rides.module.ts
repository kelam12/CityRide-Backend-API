// backend/src/rides/rides.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { Ride } from './ride.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride]),
    UsersModule,
  ],
  providers: [RidesService],
  controllers: [RidesController],
  exports: [RidesService],
})
export class RidesModule {}