import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for all origins (you can restrict this later)
  app.enableCors({ 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 🌱 Seed database with test users
  const seedService = app.get(SeedService);
  await seedService.seedUsers();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // ✅ Bind to all interfaces for cloud deployment
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();