import type { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export const enum TelegramErrorMessage {
  MESSAGE_CONTENT_IDENTICAL = `400: Bad Request: message is not modified: specified new message content ` +
    `and reply markup are exactly the same as a current content and reply markup ` +
    `of the message`,
  TOPIC_NOT_FOUND = `Bad Request: message thread not found`,
}

export const TELEGRAM_BASE_EXTRA: ExtraReplyMessage = { parse_mode: 'HTML' };
