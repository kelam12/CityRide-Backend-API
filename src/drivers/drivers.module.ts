// backend/src/driver/driver.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Ride } from '../rides/ride.entity';
import { UsersModule } from '../users/users.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride]),
    UsersModule,
    GatewayModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}