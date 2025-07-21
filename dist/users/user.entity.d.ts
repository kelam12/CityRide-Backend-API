import { Ride } from '../rides/ride.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'rider' | 'driver';
    isActive: boolean;
    ridesAsRider: Ride[];
    ridesAsDriver: Ride[];
}
