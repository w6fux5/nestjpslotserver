import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserSubscriber } from '@/entity-subscribers/user-subscriber';

export const ormConfig = registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
    subscribers: [UserSubscriber],
    // dropSchema: Boolean(Number.parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
