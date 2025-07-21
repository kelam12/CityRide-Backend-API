import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async checkHealth() {
    try {
      // Test database connection
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'success',
        message: 'Ahmed Taxi Backend is running!',
        database: 'connected',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('database')
  async checkDatabase() {
    try {
      const result = await this.dataSource.query('SELECT NOW() as current_time');
      return {
        status: 'success',
        message: 'Database connection successful',
        current_time: result[0].current_time,
        database_type: this.dataSource.driver.options.type,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database query failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
