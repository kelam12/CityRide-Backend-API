"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const riders_module_1 = require("./riders/riders.module");
const drivers_module_1 = require("./drivers/drivers.module");
const rides_module_1 = require("./rides/rides.module");
const gateway_module_1 = require("./gateway/gateway.module");
const health_module_1 = require("./health/health.module");
const user_entity_1 = require("./users/user.entity");
const ride_entity_1 = require("./rides/ride.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
                port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT),
                username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
                password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
                database: process.env.DATABASE_URL ? undefined : process.env.DB_DATABASE,
                entities: [user_entity_1.User, ride_entity_1.Ride],
                synchronize: true,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            riders_module_1.RidersModule,
            drivers_module_1.DriversModule,
            rides_module_1.RidesModule,
            gateway_module_1.GatewayModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map