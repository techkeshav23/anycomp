import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User, Specialist, ServiceOffering, PlatformFee, Media } from './entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  // NEVER use synchronize: true in production - it can drop columns/tables
  // Use migrations instead for production schema changes
  synchronize: process.env.NODE_ENV === 'development',
  // Set to true or ['error'] if you want to see queries
  // Options: true | false | ['query', 'error', 'schema', 'warn', 'info', 'log']
  logging: ['error'],
  entities: [User, Specialist, ServiceOffering, PlatformFee, Media],
  // Migrations config for production
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});
