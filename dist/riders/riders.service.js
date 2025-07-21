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
exports.RidersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ride_entity_1 = require("../rides/ride.entity");
const users_service_1 = require("../users/users.service");
let RidersService = class RidersService {
    constructor(rideRepository, usersService) {
        this.rideRepository = rideRepository;
        this.usersService = usersService;
    }
    async createRide(riderId, pickupLocation, dropoffLocation) {
        const rider = await this.usersService.findById(riderId);
        if (!rider)
            throw new common_1.NotFoundException('Rider not found');
        const ride = this.rideRepository.create({
            rider,
            pickupLocation,
            dropoffLocation,
            status: 'pending',
            requestedAt: new Date(),
        });
        return await this.rideRepository.save(ride);
    }
    async getRiderHistory(riderId) {
        return this.rideRepository.find({
            where: { rider: { id: riderId } },
            relations: ['rider', 'driver'],
            order: { requestedAt: 'DESC' },
        });
    }
};
exports.RidersService = RidersService;
exports.RidersService = RidersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], RidersService);
//# sourceMappingURL=riders.service.js.map