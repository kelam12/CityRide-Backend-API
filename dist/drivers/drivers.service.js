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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ride_entity_1 = require("../rides/ride.entity");
const users_service_1 = require("../users/users.service");
const ride_gateway_1 = require("../gateway/ride.gateway");
let DriversService = class DriversService {
    constructor(rideRepository, usersService, rideGateway) {
        this.rideRepository = rideRepository;
        this.usersService = usersService;
        this.rideGateway = rideGateway;
    }
    async acceptRide(driverId, rideId) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['rider', 'driver'],
        });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        if (ride.status !== 'pending')
            throw new common_1.BadRequestException('Ride already accepted');
        const driver = await this.usersService.findOneByIdOrFail(driverId);
        ride.driver = driver;
        ride.status = 'accepted';
        ride.acceptedAt = new Date();
        const updatedRide = await this.rideRepository.save(ride);
        this.rideGateway.broadcastRideAccepted(updatedRide);
        return updatedRide;
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        ride_gateway_1.RideGateway])
], DriversService);
//# sourceMappingURL=drivers.service.js.map