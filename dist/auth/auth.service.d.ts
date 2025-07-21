import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export type UserRole = 'rider' | 'driver';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(name: string, email: string, phone: string, password: string, role: UserRole): Promise<{
        accessToken: string;
    }>;
    validateUser(emailOrPhone: string, password: string): Promise<User>;
    login(emailOrPhone: string, password: string): Promise<{
        accessToken: string;
        userId: string;
        role: UserRole;
    }>;
}
