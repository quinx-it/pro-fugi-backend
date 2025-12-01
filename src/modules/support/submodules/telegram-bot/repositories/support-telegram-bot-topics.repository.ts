import { HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { SUPPORT_TELEGRAM_BOT_TOPICS_REDIS_KEY } from '@/modules/support/submodules/telegram-bot/constants';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { InjectRedis } from '@/shared/decorators';
import { RedisUtil } from '@/shared/utils/redis.util';

@Injectable()
export class SupportTelegramBotTopicsRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async findOne(
    telegramUserId: number,
    throwIfNotFound: false,
  ): Promise<number | null>;

  async findOne(
    telegramUserId: number,
    throwIfNotFound: true,
  ): Promise<number | null>;

  async findOne(
    telegramUserId: number,
    throwIfNotFound: boolean,
  ): Promise<number | null> {
    const adminChatTopicId = await RedisUtil.getFromHashTable<number>(
      this.redis,
      SUPPORT_TELEGRAM_BOT_TOPICS_REDIS_KEY,
      telegramUserId.toString(),
    );

    if (!adminChatTopicId) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Admin chat topic id',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return adminChatTopicId;
  }

  async createOne(
    telegramUserId: number,
    adminChatTopicId: number,
  ): Promise<number> {
    await RedisUtil.addToHashTable<number>(
      this.redis,
      SUPPORT_TELEGRAM_BOT_TOPICS_REDIS_KEY,

      telegramUserId.toString(),
      adminChatTopicId,
    );

    return adminChatTopicId;
  }

  async destroyOne(telegramUserId: number): Promise<void> {
    await RedisUtil.removeFromHashTable(
      this.redis,
      SUPPORT_TELEGRAM_BOT_TOPICS_REDIS_KEY,
      telegramUserId.toString(),
    );
  }
}
