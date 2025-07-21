import { RidesService } from '../rides/rides.service';
import { UsersService } from '../users/users.service';
import { CreateRideDto } from '../rides/dto/create-ride.dto';
export declare class RidersController {
    private readonly ridesService;
    private readonly usersService;
    constructor(ridesService: RidesService, usersService: UsersService);
    requestRide(dto: CreateRideDto): Promise<import("../rides/ride.entity").Ride>;
}
