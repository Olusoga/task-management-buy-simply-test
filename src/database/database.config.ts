import {registerAs} from '@nestjs/config';
import {config as dotenvConfig} from 'dotenv';
import {join} from 'path';
import {DataSource} from 'typeorm';

dotenvConfig({path: '.env'});

const isProduction = process.env.NODE_ENV === 'production';
const entitiesPath = isProduction
  ? join(__dirname, '../dist/**/*.entity{.js,.ts}')
  : join(__dirname, '../**/*.entity{.ts,.js}');
const migrationsPath = isProduction
  ? join(__dirname, '../dist/src/database/migrations/*{.js,.ts}')
  : join(__dirname, '../database/migrations/*{.ts,.js}');

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  ssl: isProduction ? {rejectUnauthorized: false} : false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  extra: {max: 10, idleTimeoutMillis: 30000},
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
}));

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_DATABASE,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});
