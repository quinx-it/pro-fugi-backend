import { DynamicModule, Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

import {
  REDIS_NULL_STR,
  REDIS_PROVIDER_NAME,
} from '@/shared/constants/redis.constants';

export class RedisUtil {
  static getModule(config: RedisOptions): DynamicModule {
    const redisProvider: Provider<Redis> = {
      provide: REDIS_PROVIDER_NAME,
      useFactory: () => new Redis(config),
    };

    return {
      module: RedisUtil,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }

  static async get<T>(
    redis: Redis,
    key: string,
  ): Promise<T | null | undefined> {
    const valueStr = await redis.get(key);

    if (valueStr === null) {
      return undefined;
    }

    if (valueStr === REDIS_NULL_STR) {
      return null;
    }

    const value = JSON.parse(valueStr);

    return value as T;
  }

  static async set<T>(
    redis: Redis,
    key: string,
    value: T | null,
    expiresAt?: Date,
  ): Promise<T | null> {
    const valueStr = value !== null ? JSON.stringify(value) : REDIS_NULL_STR;

    await redis.set(key, valueStr);

    if (expiresAt) {
      const expiresAtSeconds = Math.round(expiresAt.getTime() / 1000);

      await redis.expire(key, expiresAtSeconds);
    }

    return value;
  }

  static async delete(redis: Redis, key: string): Promise<void> {
    await redis.del(key);
  }

  static async addToSet<T>(
    redis: Redis,
    setName: string,
    values: Set<T>,
  ): Promise<Set<T>> {
    const { size } = values;

    if (size === 0) {
      return new Set();
    }

    const strValues = Array.from(values).map((value) => JSON.stringify(value));

    await redis.sadd(setName, strValues);

    return values;
  }

  static async getFromSet<T>(redis: Redis, setName: string): Promise<Set<T>> {
    const strValues = await redis.smembers(setName);

    const values = strValues.map((strValue) => JSON.parse(strValue) as T);

    return new Set(values);
  }

  static async removeFromSet<T>(
    redis: Redis,
    setName: string,
    values?: Set<T>,
  ): Promise<number> {
    if (values) {
      const strValues = Array.from(values).map((value) =>
        JSON.stringify(value),
      );

      const affected = await redis.srem(setName, strValues);

      return affected;
    }

    const affected = await redis.scard(setName);

    await redis.del(setName);

    return affected;
  }
}
