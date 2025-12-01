import { HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { SUPPORT_TELEGRAM_BOT_USERS_REDIS_KEY } from '@/modules/support/submodules/telegram-bot/constants';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { InjectRedis } from '@/shared/decorators';
import { RedisUtil } from '@/shared/utils/redis.util';

@Injectable()
export class SupportTelegramBotUsersRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async findOne(
    adminChatTopicId: number,
    throwIfNotFound: false,
  ): Promise<number | null>;

  async findOne(
    adminChatTopicId: number,
    throwIfNotFound: true,
  ): Promise<number>;

  async findOne(
    adminChatTopicId: number,
    throwIfNotFound: boolean,
  ): Promise<number | null> {
    const telegramBotUserId = await RedisUtil.getFromHashTable<number>(
      this.redis,
      SUPPORT_TELEGRAM_BOT_USERS_REDIS_KEY,
      adminChatTopicId.toString(),
    );

    if (!telegramBotUserId) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Telegram bot user id',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return telegramBotUserId;
  }

  async createOne(
    adminChatTopicId: number,
    telegramUserId: number,
  ): Promise<number> {
    await RedisUtil.addToHashTable<number>(
      this.redis,
      SUPPORT_TELEGRAM_BOT_USERS_REDIS_KEY,
      adminChatTopicId.toString(),
      telegramUserId,
    );

    return adminChatTopicId;
  }

  async destroyOne(adminChatTopicId: number): Promise<void> {
    await RedisUtil.removeFromHashTable(
      this.redis,
      SUPPORT_TELEGRAM_BOT_USERS_REDIS_KEY,
      adminChatTopicId.toString(),
    );
  }
}
