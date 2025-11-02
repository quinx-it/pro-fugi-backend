import { HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import objectHash from 'object-hash';

import { CONFIRMATION_CODE_REDIS_KEY_TEMPLATE } from '@/modules/auth/submodules/confirmations/constants';
import { IConfirmationCodeEntity } from '@/modules/auth/submodules/confirmations/types';
import { InjectRedis } from '@/modules/redis/decorators';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { RedisUtil } from '@/shared/utils/redis.util';

@Injectable()
export class ConfirmationCodesRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async createOne<TParams = unknown>(
    subject: string,
    params: TParams,
    value: string,
    expiresAt: Date,
  ): Promise<IConfirmationCodeEntity> {
    const key = ConfirmationCodesRepository.getRedisEntryName(subject, value);

    const expiresAtSeconds = Math.round(expiresAt.getTime() / 1000);

    const entity = {
      subject,
      value,
      expiresAt: new Date(expiresAtSeconds * 1000),
      params,
    };

    await RedisUtil.set<TParams>(this.redis, key, params);

    await this.redis.expire(key, expiresAtSeconds);

    return entity;
  }

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfNotFound: false,
  ): Promise<IConfirmationCodeEntity<TParams> | null>;

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfNotFound: true,
  ): Promise<IConfirmationCodeEntity<TParams>>;

  async findOne<TParams = unknown>(
    subject: string,
    value: string,
    throwIfNotFound: boolean,
  ): Promise<IConfirmationCodeEntity<TParams> | null> {
    const key = ConfirmationCodesRepository.getRedisEntryName(subject, value);

    const expiresAt = (await this.redis.ttl(key)) || null;

    const params = (await RedisUtil.get<TParams>(this.redis, key)) || null;

    if (!params || !expiresAt) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Confirmation code',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return { subject, params, value, expiresAt: new Date(expiresAt) };
  }

  async destroyOne(subject: string, value: string): Promise<void> {
    const key = ConfirmationCodesRepository.getRedisEntryName(subject, value);

    await this.redis.del(key);
  }

  static getRedisEntryName(subject: string, value: string): string {
    const hash = objectHash({ subject, value });

    return CONFIRMATION_CODE_REDIS_KEY_TEMPLATE.execute({ value: hash });
  }
}
