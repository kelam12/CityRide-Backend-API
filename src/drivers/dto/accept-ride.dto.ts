// backend/src/drivers/dto/accept-ride.dto.ts

import { IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptRideDto {
  @IsNotEmpty()
  @IsUUID()
  driverId!: string;

  @IsNotEmpty()
  @IsUUID()
  rideId!: string;
}