import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideGateway } from './ride.gateway';
import { Ride } from '../rides/ride.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, User])],
  providers: [RideGateway],
  exports: [RideGateway],
})
export class GatewayModule {}