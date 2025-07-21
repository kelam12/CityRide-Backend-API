// backend/src/rides/rides.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './ride.entity';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post('request')
  async createRide(@Body() dto: CreateRideDto): Promise<Ride> {
    return this.ridesService.createRide(dto);
  }

  @Get(':id')
  async getRideById(@Param('id') id: string): Promise<Ride> {
    return this.ridesService.getRideById(id);
  }
}