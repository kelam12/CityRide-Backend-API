import { DriversService } from './drivers.service';
import { AcceptRideDto } from './dto/accept-ride.dto';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    acceptRide(dto: AcceptRideDto): Promise<import("../rides/ride.entity").Ride>;
}
