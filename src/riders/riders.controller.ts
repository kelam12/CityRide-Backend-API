// backend/src/riders/riders.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RidesService } from '../rides/rides.service';
import { UsersService } from '../users/users.service';
import { CreateRideDto } from '../rides/dto/create-ride.dto';

@Controller('riders')
export class RidersController {
  constructor(
    private readonly ridesService: RidesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('request-ride')
  async requestRide(@Body() dto: CreateRideDto) {
    const rider = await this.usersService.findById(dto.riderId);
    if (!rider) throw new BadRequestException('Invalid rider');

    // Create ride without gateway call - this is for HTTP API usage only
    const ride = await this.ridesService.createRide(dto);

    return ride;
  }
}