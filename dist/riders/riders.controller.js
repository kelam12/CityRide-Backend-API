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
exports.RidersController = void 0;
const common_1 = require("@nestjs/common");
const rides_service_1 = require("../rides/rides.service");
const users_service_1 = require("../users/users.service");
const create_ride_dto_1 = require("../rides/dto/create-ride.dto");
let RidersController = class RidersController {
    constructor(ridesService, usersService) {
        this.ridesService = ridesService;
        this.usersService = usersService;
    }
    async requestRide(dto) {
        const rider = await this.usersService.findById(dto.riderId);
        if (!rider)
            throw new common_1.BadRequestException('Invalid rider');
        const ride = await this.ridesService.createRide(dto);
        return ride;
    }
};
exports.RidersController = RidersController;
__decorate([
    (0, common_1.Post)('request-ride'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ride_dto_1.CreateRideDto]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "requestRide", null);
exports.RidersController = RidersController = __decorate([
    (0, common_1.Controller)('riders'),
    __metadata("design:paramtypes", [rides_service_1.RidesService,
        users_service_1.UsersService])
], RidersController);
//# sourceMappingURL=riders.controller.js.map