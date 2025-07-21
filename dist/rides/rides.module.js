"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rides_service_1 = require("./rides.service");
const rides_controller_1 = require("./rides.controller");
const ride_entity_1 = require("./ride.entity");
const users_module_1 = require("../users/users.module");
let RidesModule = class RidesModule {
};
exports.RidesModule = RidesModule;
exports.RidesModule = RidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ride_entity_1.Ride]),
            users_module_1.UsersModule,
        ],
        providers: [rides_service_1.RidesService],
        controllers: [rides_controller_1.RidesController],
        exports: [rides_service_1.RidesService],
    })
], RidesModule);
//# sourceMappingURL=rides.module.js.map