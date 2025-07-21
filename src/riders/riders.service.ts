// backend/src/riders/riders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../rides/ride.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    private readonly usersService: UsersService,
  ) {}

  async createRide(
    riderId: string,
    pickupLocation: string,
    dropoffLocation: string,
  ): Promise<Ride> {
    const rider = await this.usersService.findById(riderId);
    if (!rider) throw new NotFoundException('Rider not found');

    const ride = this.rideRepository.create({
      rider,
      pickupLocation,
      dropoffLocation,
      status: 'pending',
      requestedAt: new Date(),
    });

    return await this.rideRepository.save(ride);
  }

  async getRiderHistory(riderId: string): Promise<Ride[]> {
    return this.rideRepository.find({
      where: { rider: { id: riderId } },
      relations: ['rider', 'driver'],
      order: { requestedAt: 'DESC' },
    });
  }
}