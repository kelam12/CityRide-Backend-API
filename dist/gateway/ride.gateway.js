"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ride_entity_1 = require("../rides/ride.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let RideGateway = class RideGateway {
    constructor(rideRepository, userRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.onlineDrivers = new Map();
        this.onlineRiders = new Map();
    }
    handleConnection(client) {
        console.log(`✅ Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
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
    handleDriverOnline(data, client) {
        this.onlineDrivers.set(data.driverId, client);
        console.log(`🚗 Driver ${data.driverId} connected via ${client.id}`);
    }
    handleRiderOnline(data, client) {
        this.onlineRiders.set(data.riderId, client);
        console.log(`🚕 Rider ${data.riderId} connected via ${client.id}`);
    }
    async handleRequestRide(data) {
        try {
            console.log(`🔍 Looking for rider: ${data.riderId}`);
            console.log(`📋 Received ride request data:`, data);
            const rider = await this.userRepository.findOne({ where: { id: data.riderId } });
            if (!rider) {
                console.error(`❌ Rider ${data.riderId} not found in database`);
                const allUsers = await this.userRepository.find();
                console.log(`📊 Total users in database: ${allUsers.length}`);
                allUsers.forEach(user => {
                    console.log(`- ${user.role}: ${user.id} (${user.name})`);
                });
                return;
            }
            console.log(`✅ Found rider: ${rider.name} (${rider.role})`);
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
            const populatedRide = await this.rideRepository.findOne({
                where: { id: savedRide.id },
                relations: ['rider'],
            });
            if (populatedRide) {
                console.log(`📤 Emitting ride request to drivers`);
                this.emitRideRequest(populatedRide);
            }
        }
        catch (error) {
            console.error('❌ Failed to handle ride request:', error);
        }
    }
    async handleAcceptRide(data) {
        var _a;
        try {
            const ride = await this.rideRepository.findOne({
                where: { id: data.ride.id },
                relations: ['rider', 'driver'],
            });
            if (!ride) {
                console.error(`❌ Ride ${data.ride.id} not found`);
                return;
            }
            const driver = await this.userRepository.findOne({ where: { id: data.driverId } });
            if (!driver) {
                console.error(`❌ Driver ${data.driverId} not found`);
                return;
            }
            ride.driver = driver;
            ride.status = 'accepted';
            ride.acceptedAt = new Date();
            const updatedRide = await this.rideRepository.save(ride);
            const socket = this.onlineRiders.get(data.riderId);
            if (socket) {
                socket.emit('ride-accepted', {
                    id: updatedRide.id,
                    driverId: (_a = updatedRide.driver) === null || _a === void 0 ? void 0 : _a.id,
                    status: updatedRide.status,
                    pickupLocation: updatedRide.pickupLocation,
                    dropoffLocation: updatedRide.dropoffLocation,
                });
                console.log(`✅ Notified rider ${data.riderId} of acceptance`);
            }
            else {
                console.warn(`⚠️ Rider ${data.riderId} not connected`);
            }
        }
        catch (error) {
            console.error('❌ Failed to handle ride acceptance:', error);
        }
    }
    emitRideRequest(ride) {
        var _a, _b, _c, _d;
        const payload = {
            id: ride.id,
            pickupLocation: ride.pickupLocation,
            dropoffLocation: ride.dropoffLocation,
            lat: (_a = ride.lat) !== null && _a !== void 0 ? _a : 0,
            lng: (_b = ride.lng) !== null && _b !== void 0 ? _b : 0,
            riderId: (_d = (_c = ride.rider) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '',
        };
        const count = this.onlineDrivers.size;
        console.log(`📊 Broadcasting to ${count} drivers`);
        for (const [driverId, socket] of this.onlineDrivers.entries()) {
            try {
                socket.emit('new_ride_request', payload);
                console.log(`📡 Sent ride ${ride.id} to driver ${driverId}`);
            }
            catch (e) {
                console.warn(`❌ Emit failed for driver ${driverId}:`, e);
            }
        }
        console.log(`✅ Broadcasted ride request to ${count} drivers`);
    }
    notifyRideAccepted(riderId, ride) {
        var _a, _b;
        const socket = this.onlineRiders.get(riderId);
        if (socket) {
            socket.emit('ride-accepted', {
                id: ride.id,
                driverId: (_b = (_a = ride.driver) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '',
                status: ride.status,
            });
            console.log(`📨 Notified rider ${riderId} about ride ${ride.id}`);
        }
    }
    broadcastRideAccepted(ride) {
        var _a, _b, _c, _d;
        const payload = {
            rideId: ride.id,
            driverId: (_b = (_a = ride.driver) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '',
            riderId: (_d = (_c = ride.rider) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '',
            status: ride.status,
        };
        this.server.emit('ride-accepted', payload);
        console.log(`📢 Broadcasted ride ${ride.id} as accepted`);
    }
};
exports.RideGateway = RideGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RideGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('driverOnline'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RideGateway.prototype, "handleDriverOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('riderOnline'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RideGateway.prototype, "handleRiderOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_ride'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideGateway.prototype, "handleRequestRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('accept_ride'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideGateway.prototype, "handleAcceptRide", null);
exports.RideGateway = RideGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __param(0, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RideGateway);
//# sourceMappingURL=ride.gateway.js.map