import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { redisConfig } from '@/configs';
import { supportConfig } from '@/configs/support.config';
import {
  SupportTelegramBotTopicsRepository,
  SupportTelegramBotUsersRepository,
} from '@/modules/support/submodules/telegram-bot/repositories';
import { SupportTelegramBotService } from '@/modules/support/submodules/telegram-bot/support-telegram-bot.service';
import { RedisUtil } from '@/shared/utils/redis.util';

const { telegramBot } = supportConfig;

@Module({
  imports: [
    TelegrafModule.forRoot(telegramBot),
    RedisUtil.getModule(redisConfig),
  ],
  providers: [
    SupportTelegramBotService,
    SupportTelegramBotUsersRepository,
    SupportTelegramBotTopicsRepository,
  ],
})
export class SupportTelegramBotModule {}
