import Redis from 'ioredis';

import { REDIS_NULL_STR } from '@/shared/constants/redis.constants';

export class RedisUtil {
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
  ): Promise<T | null> {
    const valueStr = value !== null ? JSON.stringify(value) : REDIS_NULL_STR;

    await redis.set(key, valueStr);

    return value;
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
