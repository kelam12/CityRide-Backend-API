import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Ride } from '../rides/ride.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
@WebSocketGateway({ cors: true })
export class RideGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private onlineDrivers = new Map<string, Socket>();
  private onlineRiders = new Map<string, Socket>();

  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);

    for (const [driverId, socket] of this.onlineDrivers.entries()) {
      if (socket.id === client.id) {
        this.onlineDrivers.delete(driverId);
        console.log(`❌ Disconnected driver: ${driverId}`);
        return;
      }
    }

    for (const [riderId, socket] of this.onlineRiders.entries()) {
      if (socket.id === client.id) {
        this.onlineRiders.delete(riderId);
        console.log(`❌ Disconnected rider: ${riderId}`);
        return;
      }
    }
  }

  @SubscribeMessage('driverOnline')
  handleDriverOnline(
    @MessageBody() data: { driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineDrivers.set(data.driverId, client);
    console.log(`🚗 Driver ${data.driverId} connected via ${client.id}`);
  }

  @SubscribeMessage('riderOnline')
  handleRiderOnline(
    @MessageBody() data: { riderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineRiders.set(data.riderId, client);
    console.log(`🚕 Rider ${data.riderId} connected via ${client.id}`);
  }

  @SubscribeMessage('request_ride')
  async handleRequestRide(
    @MessageBody() data: {
      id: string;
      pickupLocation: string;
      dropoffLocation: string;
      lat: number;
      lng: number;
      riderId: string;
    },
  ) {
    try {
      console.log(`🔍 Looking for rider: ${data.riderId}`);
      console.log(`📋 Received ride request data:`, data);
      
      // Find the rider
      const rider = await this.userRepository.findOne({ where: { id: data.riderId } });
      
      if (!rider) {
        console.error(`❌ Rider ${data.riderId} not found in database`);
        
        // Debug: Check all users in database
        const allUsers = await this.userRepository.find();
        console.log(`📊 Total users in database: ${allUsers.length}`);
        allUsers.forEach(user => {
          console.log(`- ${user.role}: ${user.id} (${user.name})`);
        });
        return;
      }

      console.log(`✅ Found rider: ${rider.name} (${rider.role})`);

      // Create and save ride directly
      const ride = this.rideRepository.create({
        rider,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        lat: data.lat,
        lng: data.lng,
        status: 'pending',
        requestedAt: new Date(),
      });

      const savedRide = await this.rideRepository.save(ride);
      console.log(`💾 Ride saved with ID: ${savedRide.id}`);

      // Get populated ride
      const populatedRide = await this.rideRepository.findOne({
        where: { id: savedRide.id },
        relations: ['rider'],
      });

      if (populatedRide) {
        console.log(`📤 Emitting ride request to drivers`);
        this.emitRideRequest(populatedRide);
      }
    } catch (error) {
      console.error('❌ Failed to handle ride request:', error);
    }
  }

  @SubscribeMessage('accept_ride')
  async handleAcceptRide(
    @MessageBody() data: {
      riderId: string;
      ride: {
        id: string;
        pickupLocation: string;
        dropoffLocation: string;
        lat: number;
        lng: number;
        riderId: string;
      };
      driverId: string;
    },
  ) {
    try {
      // Find the ride
      const ride = await this.rideRepository.findOne({
        where: { id: data.ride.id },
        relations: ['rider', 'driver'],
      });

      if (!ride) {
        console.error(`❌ Ride ${data.ride.id} not found`);
        return;
      }

      // Find the driver
      const driver = await this.userRepository.findOne({ where: { id: data.driverId } });
      if (!driver) {
        console.error(`❌ Driver ${data.driverId} not found`);
        return;
      }

      // Update ride with driver assignment
      ride.driver = driver;
      ride.status = 'accepted';
      ride.acceptedAt = new Date();

      const updatedRide = await this.rideRepository.save(ride);

      // Notify rider of acceptance
      const socket = this.onlineRiders.get(data.riderId);
      if (socket) {
        socket.emit('ride-accepted', {
          id: updatedRide.id,
          driverId: updatedRide.driver?.id,
          status: updatedRide.status,
          pickupLocation: updatedRide.pickupLocation,
          dropoffLocation: updatedRide.dropoffLocation,
        });
        console.log(`✅ Notified rider ${data.riderId} of acceptance`);
      } else {
        console.warn(`⚠️ Rider ${data.riderId} not connected`);
      }
    } catch (error) {
      console.error('❌ Failed to handle ride acceptance:', error);
    }
  }

  emitRideRequest(ride: Ride) {
    const payload = {
      id: ride.id,
      pickupLocation: ride.pickupLocation,
      dropoffLocation: ride.dropoffLocation,
      lat: ride.lat ?? 0,
      lng: ride.lng ?? 0,
      riderId: ride.rider?.id ?? '',
    };

    const count = this.onlineDrivers.size;
    console.log(`📊 Broadcasting to ${count} drivers`);

    for (const [driverId, socket] of this.onlineDrivers.entries()) {
      try {
        socket.emit('new_ride_request', payload);
        console.log(`📡 Sent ride ${ride.id} to driver ${driverId}`);
      } catch (e) {
        console.warn(`❌ Emit failed for driver ${driverId}:`, e);
      }
    }

    console.log(`✅ Broadcasted ride request to ${count} drivers`);
  }

  notifyRideAccepted(riderId: string, ride: Ride) {
    const socket = this.onlineRiders.get(riderId);
    if (socket) {
      socket.emit('ride-accepted', {
        id: ride.id,
        driverId: ride.driver?.id ?? '',
        status: ride.status,
      });
      console.log(`📨 Notified rider ${riderId} about ride ${ride.id}`);
    }
  }

  broadcastRideAccepted(ride: Ride) {
    const payload = {
      rideId: ride.id,
      driverId: ride.driver?.id ?? '',
      riderId: ride.rider?.id ?? '',
      status: ride.status,
    };

    this.server.emit('ride-accepted', payload);
    console.log(`📢 Broadcasted ride ${ride.id} as accepted`);
  }
}