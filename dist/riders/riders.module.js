"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const riders_controller_1 = require("./riders.controller");
const rides_service_1 = require("../rides/rides.service");
const users_service_1 = require("../users/users.service");
const ride_entity_1 = require("../rides/ride.entity");
const user_entity_1 = require("../users/user.entity");
const ride_gateway_1 = require("../gateway/ride.gateway");
let RidersModule = class RidersModule {
};
exports.RidersModule = RidersModule;
exports.RidersModule = RidersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ride_entity_1.Ride, user_entity_1.User])],
        controllers: [riders_controller_1.RidersController],
        providers: [rides_service_1.RidesService, users_service_1.UsersService, ride_gateway_1.RideGateway],
    })
], RidersModule);
//# sourceMappingURL=riders.module.js.map