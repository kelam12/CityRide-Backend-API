import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './ride.entity';
export declare class RidesController {
    private readonly ridesService;
    constructor(ridesService: RidesService);
    createRide(dto: CreateRideDto): Promise<Ride>;
    getRideById(id: string): Promise<Ride>;
}
