// backend/src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body.emailOrPhone, body.password);
    } catch (err) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(
      body.name,
      body.email,
      body.phone,
      body.password,
      body.role,
    );
  }
}