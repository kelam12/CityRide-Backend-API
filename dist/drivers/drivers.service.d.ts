import { Repository } from 'typeorm';
import { Ride } from '../rides/ride.entity';
import { UsersService } from '../users/users.service';
import { RideGateway } from '../gateway/ride.gateway';
export declare class DriversService {
    private readonly rideRepository;
    private readonly usersService;
    private readonly rideGateway;
    constructor(rideRepository: Repository<Ride>, usersService: UsersService, rideGateway: RideGateway);
    acceptRide(driverId: string, rideId: string): Promise<Ride>;
}
