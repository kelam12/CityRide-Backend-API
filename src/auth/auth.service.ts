import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

export type UserRole = 'rider' | 'driver';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole,
  ): Promise<{ accessToken: string }> {
    const existing = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isActive: true,
    });

    await this.userRepository.save(user);

    const payload = { username: user.email, sub: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async validateUser(emailOrPhone: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async login(
    emailOrPhone: string,
    password: string,
  ): Promise<{ accessToken: string; userId: string; role: UserRole }> {
    const user = await this.validateUser(emailOrPhone, password);

    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      role: user.role,
    };
  }
}