import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity'; // ✅ Import User entity
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Register repository
    JwtModule.register({
      secret: 'your-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}