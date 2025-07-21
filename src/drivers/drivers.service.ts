// backend/src/driver/driver.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../rides/ride.entity';
import { UsersService } from '../users/users.service';
import { RideGateway } from '../gateway/ride.gateway';
import { User } from '../users/user.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    private readonly usersService: UsersService,
    private readonly rideGateway: RideGateway,
  ) {}

  async acceptRide(driverId: string, rideId: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['rider', 'driver'],
    });

    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'pending') throw new BadRequestException('Ride already accepted');

    const driver = await this.usersService.findOneByIdOrFail(driverId);

    ride.driver = driver;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();

    const updatedRide = await this.rideRepository.save(ride);

    this.rideGateway.broadcastRideAccepted(updatedRide);

    return updatedRide;
  }
}