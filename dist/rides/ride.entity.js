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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let Ride = class Ride {
};
exports.Ride = Ride;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ride.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ridesAsRider),
    __metadata("design:type", user_entity_1.User)
], Ride.prototype, "rider", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ridesAsDriver, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Ride.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ride.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ride.prototype, "dropoffLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Ride.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ride.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ride.prototype, "acceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ride.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Ride.prototype, "updatedAt", void 0);
exports.Ride = Ride = __decorate([
    (0, typeorm_1.Entity)()
], Ride);
//# sourceMappingURL=ride.entity.js.map