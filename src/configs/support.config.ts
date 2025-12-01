import {
  SUPPORT_TELEGRAM_BOT_ADMIN_CHAT_ID,
  SUPPORT_TELEGRAM_BOT_ENABLED,
  SUPPORT_TELEGRAM_BOT_TOKEN,
} from '@/configs/env';
import { AppException, ERROR_MESSAGES } from '@/shared';

if (
  SUPPORT_TELEGRAM_BOT_ENABLED &&
  (!SUPPORT_TELEGRAM_BOT_TOKEN || !SUPPORT_TELEGRAM_BOT_ADMIN_CHAT_ID)
) {
  throw AppException.fromTemplate(ERROR_MESSAGES.NOT_PROVIDED_TEMPLATE, {
    value: 'Support telegram bot token or/and admin chat id',
  });
}

export const supportConfig = {
  telegramBot: {
    isEnabled: SUPPORT_TELEGRAM_BOT_ENABLED,
    token: SUPPORT_TELEGRAM_BOT_TOKEN,
    adminChatId: SUPPORT_TELEGRAM_BOT_ADMIN_CHAT_ID,
  },
};
