// backend/src/rides/dto/create-ride.dto.ts

import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateRideDto {
  @IsUUID()
  riderId!: string;

  @IsNotEmpty()
  @IsString()
  pickupLocation!: string;

  @IsNotEmpty()
  @IsString()
  dropoffLocation!: string;

  @IsNotEmpty()
  @IsNumber()
  lat!: number;

  @IsNotEmpty()
  @IsNumber()
  lng!: number;
}