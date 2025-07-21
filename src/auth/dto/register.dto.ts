// backend/src/auth/dto/register.dto.ts

import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber(undefined) // use undefined for any region (or 'AE' for UAE)
  phone!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @IsString()
  role!: 'rider' | 'driver';
}