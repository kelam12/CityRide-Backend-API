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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let SeedService = class SeedService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seedUsers() {
        console.log('🌱 Starting database seeding...');
        const existingUsers = await this.userRepository.count();
        if (existingUsers > 0) {
            console.log(`✅ Database already has ${existingUsers} users. Skipping seed.`);
            return;
        }
        const testRiders = [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Ahmed Hassan',
                email: 'ahmed.rider@test.com',
                phone: '+964770123456',
                password: 'password123',
                role: 'rider',
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                name: 'Sarah Ibrahim',
                email: 'sarah.rider@test.com',
                phone: '+964771123456',
                password: 'password123',
                role: 'rider',
            },
        ];
        const testDrivers = [
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Mohammed Ali',
                email: 'mohammed.driver@test.com',
                phone: '+964780123456',
                password: 'password123',
                role: 'driver',
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440004',
                name: 'Omar Khalil',
                email: 'omar.driver@test.com',
                phone: '+964781123456',
                password: 'password123',
                role: 'driver',
            },
        ];
        try {
            for (const rider of testRiders) {
                await this.userRepository.save(rider);
                console.log(`✅ Created rider: ${rider.name} (${rider.id})`);
            }
            for (const driver of testDrivers) {
                await this.userRepository.save(driver);
                console.log(`✅ Created driver: ${driver.name} (${driver.id})`);
            }
            console.log('🎉 Database seeding completed successfully!');
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map