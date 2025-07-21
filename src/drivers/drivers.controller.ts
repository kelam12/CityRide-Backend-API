// backend/src/driver/driver.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AcceptRideDto } from './dto/accept-ride.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('accept')
  async acceptRide(@Body() dto: AcceptRideDto) {
    return await this.driversService.acceptRide(dto.driverId, dto.rideId);
  }
}