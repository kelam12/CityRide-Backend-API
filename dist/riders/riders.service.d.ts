import { Repository } from 'typeorm';
import { Ride } from '../rides/ride.entity';
import { UsersService } from '../users/users.service';
export declare class RidersService {
    private readonly rideRepository;
    private readonly usersService;
    constructor(rideRepository: Repository<Ride>, usersService: UsersService);
    createRide(riderId: string, pickupLocation: string, dropoffLocation: string): Promise<Ride>;
    getRiderHistory(riderId: string): Promise<Ride[]>;
}
