import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findOneByIdOrFail(id: string): Promise<User>;
}
