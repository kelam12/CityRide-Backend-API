// backend/src/seeds/seed.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedUsers() {
    console.log('🌱 Starting database seeding...');

    // Check if users already exist
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      console.log(`✅ Database already has ${existingUsers} users. Skipping seed.`);
      return;
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

    try {
      // Insert riders
      for (const rider of testRiders) {
        await this.userRepository.save(rider);
        console.log(`✅ Created rider: ${rider.name} (${rider.id})`);
      }

      // Insert drivers
      for (const driver of testDrivers) {
        await this.userRepository.save(driver);
        console.log(`✅ Created driver: ${driver.name} (${driver.id})`);
      }

      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}
