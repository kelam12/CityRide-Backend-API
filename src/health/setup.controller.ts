// backend/src/health/setup.controller.ts

import { Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Controller('setup')
export class SetupController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('users')
  async createUsers() {
    try {
      // Check if users already exist
      const existingUsers = await this.userRepository.count();
      if (existingUsers > 0) {
        return {
          status: 'success',
          message: `Users already exist (${existingUsers} users)`,
          users: await this.userRepository.find(),
        };
      }

      // Create test riders
      const testRiders = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Ahmed Hassan',
          email: 'ahmed.rider@test.com',
          phone: '+964770123456',
          password: 'password123',
          role: 'rider' as const,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Sarah Ibrahim',
          email: 'sarah.rider@test.com',
          phone: '+964771123456',
          password: 'password123',
          role: 'rider' as const,
        },
      ];

      // Create test drivers
      const testDrivers = [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Mohammed Ali',
          email: 'mohammed.driver@test.com',
          phone: '+964780123456',
          password: 'password123',
          role: 'driver' as const,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Omar Khalil',
          email: 'omar.driver@test.com',
          phone: '+964781123456',
          password: 'password123',
          role: 'driver' as const,
        },
      ];

      const allUsers = [...testRiders, ...testDrivers];
      
      // Insert all users
      const createdUsers = await this.userRepository.save(allUsers);

      return {
        status: 'success',
        message: 'Users created successfully!',
        count: createdUsers.length,
        users: createdUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
