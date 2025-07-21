import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Ride } from '../rides/ride.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class RideGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly rideRepository;
    private readonly userRepository;
    server: Server;
    private onlineDrivers;
    private onlineRiders;
    constructor(rideRepository: Repository<Ride>, userRepository: Repository<User>);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleDriverOnline(data: {
        driverId: string;
    }, client: Socket): void;
    handleRiderOnline(data: {
        riderId: string;
    }, client: Socket): void;
    handleRequestRide(data: {
        id: string;
        pickupLocation: string;
        dropoffLocation: string;
        lat: number;
        lng: number;
        riderId: string;
    }): Promise<void>;
    handleAcceptRide(data: {
        riderId: string;
        ride: {
            id: string;
            pickupLocation: string;
            dropoffLocation: string;
            lat: number;
            lng: number;
            riderId: string;
        };
        driverId: string;
    }): Promise<void>;
    emitRideRequest(ride: Ride): void;
    notifyRideAccepted(riderId: string, ride: Ride): void;
    broadcastRideAccepted(ride: Ride): void;
}
