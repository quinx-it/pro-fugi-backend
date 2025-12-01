import { Injectable } from '@nestjs/common';
import { InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { supportConfig } from '@/configs/support.config';
import {
  SupportTelegramBotTopicsRepository,
  SupportTelegramBotUsersRepository,
} from '@/modules/support/submodules/telegram-bot/repositories';
import { TelegrafUtil } from '@/shared/utils/telegraf.util';

@Update()
@Injectable()
export class SupportTelegramBotService {
  private readonly adminChatId: number;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly topicsRepo: SupportTelegramBotTopicsRepository,
    private readonly usersRepo: SupportTelegramBotUsersRepository,
  ) {
    this.adminChatId = supportConfig.telegramBot.adminChatId;
  }

  @TelegrafUtil.onMessage()
  async onMessage(context: Context): Promise<void> {
    const messageChatId = await TelegrafUtil.getChatId(context);

    if (messageChatId !== this.adminChatId) {
      const userId = TelegrafUtil.getTelegramUserId(context);
      const userNickName = TelegrafUtil.getTelegramUserNickName(context);
      const userFullName = TelegrafUtil.getTelegramUserFullName(context);

      let topicId = await this.topicsRepo.findOne(userId, false);

      if (!topicId) {
        topicId = await TelegrafUtil.createTopic(
          context,
          this.adminChatId,
          userFullName || userNickName || userId.toString(),
        );

        await this.topicsRepo.createOne(userId, topicId);
        await this.usersRepo.createOne(topicId, userId);
      }

      await TelegrafUtil.duplicateMessage(context, this.adminChatId, topicId);
    } else {
      const topicId = await TelegrafUtil.getMessageTopic(context);

      const userId = await this.usersRepo.findOne(topicId, true);

      await TelegrafUtil.duplicateMessage(context, userId);
    }
  }
}
