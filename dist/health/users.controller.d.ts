import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class DebugController {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(): Promise<{
        status: string;
        count: number;
        users: {
            id: string;
            name: string;
            email: string;
            role: "rider" | "driver";
        }[];
        message?: undefined;
    } | {
        status: string;
        message: string;
        count: number;
        users?: undefined;
    }>;
}
