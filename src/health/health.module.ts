import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { DebugController } from './users.controller';
import { SetupController } from './setup.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [HealthController, DebugController, SetupController],
})
export class HealthModule {}
