// backend/src/rides/rides.service.ts

import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './ride.entity';
import { UsersService } from '../users/users.service';
import { CreateRideDto } from './dto/create-ride.dto';

export type RideStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    private readonly usersService: UsersService,
  ) {}

  async createRide(dto: CreateRideDto): Promise<Ride> {
    const rider = await this.usersService.findOneByIdOrFail(dto.riderId);

    const ride = this.rideRepository.create({
      rider,
      pickupLocation: dto.pickupLocation,
      dropoffLocation: dto.dropoffLocation,
      lat: dto.lat,
      lng: dto.lng,
      status: 'pending',
      requestedAt: new Date(),
    });

    const savedRide = await this.rideRepository.save(ride);

    const populatedRide = await this.rideRepository.findOne({
      where: { id: savedRide.id },
      relations: ['rider'],
    });

    if (!populatedRide) throw new NotFoundException('Ride not found after save');

    // No gateway call here - will be handled by HTTP endpoint if needed
    return populatedRide;
  }

  // New method for WebSocket-initiated rides
  async createRideViaWebSocket(dto: CreateRideDto): Promise<Ride> {
    const rider = await this.usersService.findOneByIdOrFail(dto.riderId);

    const ride = this.rideRepository.create({
      rider,
      pickupLocation: dto.pickupLocation,
      dropoffLocation: dto.dropoffLocation,
      lat: dto.lat,
      lng: dto.lng,
      status: 'pending',
      requestedAt: new Date(),
    });

    const savedRide = await this.rideRepository.save(ride);

    const populatedRide = await this.rideRepository.findOne({
      where: { id: savedRide.id },
      relations: ['rider'],
    });

    if (!populatedRide) throw new NotFoundException('Ride not found after save');

    return populatedRide;
  }

  async assignDriver(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['rider', 'driver'],
    });
    if (!ride) throw new NotFoundException('Ride not found');

    const driver = await this.usersService.findOneByIdOrFail(driverId);

    ride.driver = driver;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();

    const savedRide = await this.rideRepository.save(ride);
    
    // Return populated ride
    return this.rideRepository.findOne({
      where: { id: savedRide.id },
      relations: ['rider', 'driver'],
    }) as Promise<Ride>;
  }

  async updateRideStatus(rideId: string, status: RideStatus): Promise<Ride> {
    const ride = await this.rideRepository.findOne({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');

    ride.status = status;

    if (status === 'completed') {
      ride.completedAt = new Date();
    }

    return this.rideRepository.save(ride);
  }

  async findPendingRides(): Promise<Ride[]> {
    return this.rideRepository.find({
      where: { status: 'pending' },
      relations: ['rider'],
    });
  }

  async getRideById(id: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id },
      relations: ['rider', 'driver'],
    });

    if (!ride) throw new NotFoundException('Ride not found');

    return ride;
  }
}