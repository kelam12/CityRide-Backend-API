import { DataSource } from 'typeorm';
export declare class HealthController {
    private dataSource;
    constructor(dataSource: DataSource);
    checkHealth(): Promise<{
        status: string;
        message: string;
        database: string;
        timestamp: string;
        environment: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: string;
        timestamp: string;
        database?: undefined;
        environment?: undefined;
    }>;
    checkDatabase(): Promise<{
        status: string;
        message: string;
        current_time: any;
        database_type: import("typeorm").DatabaseType;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: string;
        current_time?: undefined;
        database_type?: undefined;
    }>;
}
