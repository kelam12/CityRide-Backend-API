import { Repository } from 'typeorm';
import { Ride } from './ride.entity';
import { UsersService } from '../users/users.service';
import { CreateRideDto } from './dto/create-ride.dto';
export type RideStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export declare class RidesService {
    private readonly rideRepository;
    private readonly usersService;
    constructor(rideRepository: Repository<Ride>, usersService: UsersService);
    createRide(dto: CreateRideDto): Promise<Ride>;
    createRideViaWebSocket(dto: CreateRideDto): Promise<Ride>;
    assignDriver(rideId: string, driverId: string): Promise<Ride>;
    updateRideStatus(rideId: string, status: RideStatus): Promise<Ride>;
    findPendingRides(): Promise<Ride[]>;
    getRideById(id: string): Promise<Ride>;
}
