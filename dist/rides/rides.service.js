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
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ride_entity_1 = require("./ride.entity");
const users_service_1 = require("../users/users.service");
let RidesService = class RidesService {
    constructor(rideRepository, usersService) {
        this.rideRepository = rideRepository;
        this.usersService = usersService;
    }
    async createRide(dto) {
        const rider = await this.usersService.findOneByIdOrFail(dto.riderId);
        const ride = this.rideRepository.create({
            rider,
            pickupLocation: dto.pickupLocation,
            dropoffLocation: dto.dropoffLocation,
            lat: dto.lat,
            lng: dto.lng,
            status: 'pending',
            requestedAt: new Date(),
        });
        const savedRide = await this.rideRepository.save(ride);
        const populatedRide = await this.rideRepository.findOne({
            where: { id: savedRide.id },
            relations: ['rider'],
        });
        if (!populatedRide)
            throw new common_1.NotFoundException('Ride not found after save');
        return populatedRide;
    }
    async createRideViaWebSocket(dto) {
        const rider = await this.usersService.findOneByIdOrFail(dto.riderId);
        const ride = this.rideRepository.create({
            rider,
            pickupLocation: dto.pickupLocation,
            dropoffLocation: dto.dropoffLocation,
            lat: dto.lat,
            lng: dto.lng,
            status: 'pending',
            requestedAt: new Date(),
        });
        const savedRide = await this.rideRepository.save(ride);
        const populatedRide = await this.rideRepository.findOne({
            where: { id: savedRide.id },
            relations: ['rider'],
        });
        if (!populatedRide)
            throw new common_1.NotFoundException('Ride not found after save');
        return populatedRide;
    }
    async assignDriver(rideId, driverId) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['rider', 'driver'],
        });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        const driver = await this.usersService.findOneByIdOrFail(driverId);
        ride.driver = driver;
        ride.status = 'accepted';
        ride.acceptedAt = new Date();
        const savedRide = await this.rideRepository.save(ride);
        return this.rideRepository.findOne({
            where: { id: savedRide.id },
            relations: ['rider', 'driver'],
        });
    }
    async updateRideStatus(rideId, status) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId } });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        ride.status = status;
        if (status === 'completed') {
            ride.completedAt = new Date();
        }
        return this.rideRepository.save(ride);
    }
    async findPendingRides() {
        return this.rideRepository.find({
            where: { status: 'pending' },
            relations: ['rider'],
        });
    }
    async getRideById(id) {
        const ride = await this.rideRepository.findOne({
            where: { id },
            relations: ['rider', 'driver'],
        });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        return ride;
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], RidesService);
//# sourceMappingURL=rides.service.js.map