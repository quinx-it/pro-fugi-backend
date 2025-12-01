import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { redisConfig } from '@/configs';
import { supportConfig } from '@/configs/support.config';
import {
  SupportTelegramBotTopicsRepository,
  SupportTelegramBotUsersRepository,
} from '@/modules/support/submodules/telegram-bot/repositories';
import { SupportTelegramBotService } from '@/modules/support/submodules/telegram-bot/support-telegram-bot.service';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { RedisUtil } from '@/shared/utils/redis.util';

const { telegramBot } = supportConfig;

const { token } = telegramBot;

if (!token) {
  throw AppException.fromTemplate(ERROR_MESSAGES.NOT_PROVIDED_TEMPLATE, {
    value: 'Support telegram token or/and admin chat id',
  });
}

@Module({
  imports: [
    TelegrafModule.forRoot({ token }),
    RedisUtil.getModule(redisConfig),
  ],
  providers: [
    SupportTelegramBotService,
    SupportTelegramBotUsersRepository,
    SupportTelegramBotTopicsRepository,
  ],
})
export class SupportTelegramBotModule {}
