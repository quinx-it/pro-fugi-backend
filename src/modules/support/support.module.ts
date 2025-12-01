import { Module } from '@nestjs/common';

import { supportConfig } from '@/configs/support.config';
import { SupportTelegramBotModule } from '@/modules/support/submodules/telegram-bot/support-telegram-bot.module';

const isTelegramBotEnabled = supportConfig.telegramBot.isEnabled;

@Module({ imports: isTelegramBotEnabled ? [SupportTelegramBotModule] : [] })
export class SupportModule {}
