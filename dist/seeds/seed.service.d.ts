import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class SeedService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    seedUsers(): Promise<void>;
}
