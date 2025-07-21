import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        userId: string;
        role: import("./auth.service").UserRole;
    }>;
    register(body: RegisterDto): Promise<{
        accessToken: string;
    }>;
}
