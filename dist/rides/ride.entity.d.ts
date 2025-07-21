import { User } from '../users/user.entity';
export declare class Ride {
    id: string;
    rider: User;
    driver: User;
    pickupLocation: string;
    dropoffLocation: string;
    lat: number;
    lng: number;
    status: string;
    requestedAt: Date;
    acceptedAt: Date;
    completedAt: Date;
    updatedAt: Date;
}
