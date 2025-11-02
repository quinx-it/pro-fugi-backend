import { createKeyv } from '@keyv/redis';
import { BullRootModuleOptions } from '@nestjs/bullmq';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { RedisOptions } from 'ioredis';
import ms from 'ms';
import { createClient } from 'redis';

import {
  REDIS_HOST_NAME,
  REDIS_HOST_PORT,
  REDIS_CACHE_TTL,
  REDIS_PASSWORD,
  REDIS_USERNAME,
  REDIS_DB_INDEX,
} from '@/configs/env';

import type { RedisClientType } from 'redis';

const REDIS_CREDENTIALS = REDIS_PASSWORD
  ? `${REDIS_USERNAME || ''}:${REDIS_PASSWORD}@`
  : '';

const REDIS_CONNECTION_STR = `redis://${REDIS_CREDENTIALS}${REDIS_HOST_NAME}:${REDIS_HOST_PORT}/${REDIS_DB_INDEX}`;

export const redisClient = createClient({
  url: REDIS_CONNECTION_STR,
  socket: {
    connectTimeout: 999999,
  },
}) as RedisClientType;

redisClient.connect();

redisClient.on('error', (err) => {
  throw err;
});

export const cacheConfig: CacheModuleOptions = {
  // @ts-expect-error Something is wrong with dependencies versioning. TODO fix
  stores: [createKeyv(redisClient)],
  ttl: ms(REDIS_CACHE_TTL),
  db: REDIS_DB_INDEX,
  isGlobal: true,
};

export const bullConfig: BullRootModuleOptions = {
  connection: {
    host: REDIS_HOST_NAME,
    port: REDIS_HOST_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    db: REDIS_DB_INDEX,
  },
};

export const redisConfig: RedisOptions = {
  host: REDIS_HOST_NAME,
  port: REDIS_HOST_PORT,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  db: REDIS_DB_INDEX,
};
