import { ArgumentsHost, ExecutionContext, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { camelCase, snakeCase } from 'lodash';
import { On } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { ContextTypeExtended, ERROR_MESSAGES } from '@/shared/constants';
import {
  TELEGRAM_BASE_EXTRA,
  TelegramErrorMessage,
} from '@/shared/constants/telegram.constants';
import { AppException } from '@/shared/exceptions';

import type { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export class TelegrafUtil {
  static async getCommandKwargs<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: true,
  ): Promise<T>;

  static async getCommandKwargs<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: false,
  ): Promise<T | null>;

  static async getCommandKwargs<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: boolean = true,
  ): Promise<T | null> {
    const { message } = context;

    if (!message) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'message',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!('text' in message)) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'message text',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { text } = message;

    const parsedData = TelegrafUtil.parseCommandKwargs(text) as T;

    const dto = plainToInstance(DataClass, parsedData);

    try {
      await validateOrReject(dto);
    } catch (error) {
      if (throwIfInvalid) {
        throw error;
      }

      return null;
    }

    return dto;
  }

  static async getChatId(context: Context): Promise<number> {
    const { chat } = context;

    if (!chat) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'chat',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!('id' in chat)) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'chat id',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { id } = chat;

    return id;
  }

  static async getCallbackData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: true,
  ): Promise<T>;

  static async getCallbackData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: false,
  ): Promise<T | null>;

  static async getCallbackData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: boolean = true,
  ): Promise<T | null> {
    const { callbackQuery } = context;

    if (!callbackQuery) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'callback query',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!('data' in callbackQuery)) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'callback query data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { data } = callbackQuery;

    const parsedData = TelegrafUtil.parseCallbackData(data).args as T;

    const dto = plainToInstance(DataClass, parsedData);

    try {
      await validateOrReject(dto);
    } catch (error) {
      if (throwIfInvalid) {
        throw error;
      }

      return null;
    }

    return dto;
  }

  static async getCallbackOrCommandData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: false,
  ): Promise<T | null>;

  static async getCallbackOrCommandData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: true,
  ): Promise<T>;

  static async getCallbackOrCommandData<T extends object>(
    context: Context,
    DataClass: new (data: Partial<T>) => T,
    throwIfInvalid: boolean = true,
  ): Promise<T | null> {
    const { message } = context;

    if (throwIfInvalid) {
      const data = message
        ? await TelegrafUtil.getCommandKwargs<T>(context, DataClass, true)
        : await TelegrafUtil.getCallbackData<T>(context, DataClass, true);

      return data;
    }

    const data = message
      ? await TelegrafUtil.getCommandKwargs<T>(context, DataClass, false)
      : await TelegrafUtil.getCallbackData<T>(context, DataClass, false);

    return data;
  }

  static toCallbackData(action: string, args: object): string {
    if (!args || Object.keys(args).length === 0) {
      return action;
    }

    const queryString = Object.entries(args)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(snakeCase(key))}=${encodeURIComponent(
            String(value),
          )}`,
      )
      .join('&');

    return `${action}?${queryString}`;
  }

  private static parseCallbackData(callbackData: string): {
    action: string;
    args: Record<string, string>;
  } {
    const match = callbackData.match(/^([^?]+)\??(.+)?$/);

    if (!match) {
      return { action: callbackData, args: {} };
    }

    const [, action, query] = match;
    const args = Object.fromEntries(
      query.split('&').map((pair) => {
        const [key, value] = pair.split('=');

        return [camelCase(decodeURIComponent(key)), decodeURIComponent(value)];
      }),
    );

    return { action, args };
  }

  static getTelegramUserId(ctx: Context): number {
    const id = ctx.from?.id;

    if (!id) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'telegram user id',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return id;
  }

  static getTelegramUserNickName(ctx: Context): string | null {
    const nickName = ctx.from?.username;

    return nickName || null;
  }

  static getTelegramUserFullName(ctx: Context): string | null {
    const firstName = ctx.from?.first_name;
    const lastName = ctx.from?.last_name;

    const fullName = [firstName, lastName].join(' ');

    return Array.from(fullName).filter((char) => char !== ' ').length
      ? fullName
      : null;
  }

  private static parseCommandKwargs(message: string): Record<string, string> {
    return message
      .trim()
      .split(/\s+/)
      .slice(1)
      .map((part) => {
        const [key, ...rest] = part.split('=');
        const value = rest.join('=');

        return key && value ? [key, value] : null;
      })
      .filter((entry): entry is [string, string] => entry !== null)
      .reduce<Record<string, string>>((acc, [key, value]) => {
        acc[camelCase(key)] = value;

        return acc;
      }, {});
  }

  static getTelegrafContext(
    hostOrContext: ExecutionContext | ArgumentsHost,
  ): Context {
    const type = hostOrContext.getType() as ContextTypeExtended;

    if (type !== ContextTypeExtended.TELEGRAF) {
      throw new AppException(
        ERROR_MESSAGES.TELEGRAF_CONTEXT_NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if ('args' in hostOrContext && Array.isArray(hostOrContext.args)) {
      const [context] = hostOrContext.args;

      if (!context) {
        throw new AppException(
          ERROR_MESSAGES.TELEGRAF_CONTEXT_NOT_FOUND,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    throw new AppException(
      ERROR_MESSAGES.TELEGRAF_CONTEXT_NOT_FOUND,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static async editOrSendMessage(
    context: Context,
    messageText: string,
    extra?: ExtraReplyMessage,
  ): Promise<void> {
    try {
      // @ts-expect-error TODO fix
      await context.editMessageText(messageText, TelegrafUtil.getExtra(extra));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message.includes(TelegramErrorMessage.MESSAGE_CONTENT_IDENTICAL)
        ) {
          return;
        }
      }

      await context.sendMessage(messageText, extra);
    }
  }

  static async getCommandArgs(context: Context): Promise<string[]> {
    const messageText = TelegrafUtil.getMessageText(context, true);

    const args = messageText.split(' ').slice(1);

    return args;
  }

  static getMessageText(context: Context, throwIfNotFound: true): string;

  static getMessageText(
    context: Context,
    throwIfNotFound: false,
  ): string | null;

  static getMessageText(
    context: Context,
    throwIfNotFound: boolean,
  ): string | null {
    const { message } = context;

    if (!message) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
          {
            value: 'message',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return null;
    }

    const { text } = message as { text: unknown };

    if (!text || typeof text !== 'string') {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
          {
            value: 'message text',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return null;
    }

    return text;
  }

  static getMessageTopic(context: Context): number {
    const { message } = context;

    if (!message) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'message',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { message_thread_id: topicId } = message as {
      message_thread_id: number;
    };

    if (!topicId || typeof topicId !== 'number') {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.TELEGRAF_NOT_FOUND_IN_CONTEXT_TEMPLATE,
        {
          value: 'message topic',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return topicId;
  }

  static async answerCallbackQueryIfRequired(context: Context): Promise<void> {
    try {
      await context.answerCbQuery();
    } catch {
      /* empty */
    }
  }

  static getCallbackRegex(actionName: string): RegExp {
    return new RegExp(`^${actionName}(\\?.+)?$`);
  }

  static onMessage(): MethodDecorator {
    return On('message');
  }

  static getExtra(extra?: ExtraReplyMessage): ExtraReplyMessage {
    return { ...TELEGRAM_BASE_EXTRA, ...extra };
  }

  static async createTopic(
    context: Context,
    chatId: number,
    name: string,
  ): Promise<number> {
    const { message_thread_id: messageThreadId } =
      (await context.telegram.callApi('createForumTopic', {
        chat_id: chatId,
        name,
      })) as { message_thread_id: number };

    return messageThreadId;
  }

  static async duplicateMessage(
    context: Context,
    chatId: number,
    topicId?: number,
  ): Promise<void> {
    const { message } = context;

    if (!message) {
      return;
    }

    const text =
      ('caption' in message && message.caption) ||
      TelegrafUtil.getMessageText(context, false) ||
      undefined;

    if ('photo' in message && message.photo?.length) {
      const largestPhoto = message.photo[message.photo.length - 1];
      await context.telegram.sendPhoto(chatId, largestPhoto.file_id, {
        caption: text,
        message_thread_id: topicId,
      });

      return;
    }

    if ('document' in message && message.document) {
      await context.telegram.sendDocument(chatId, message.document.file_id, {
        caption: text,
        message_thread_id: topicId,
      });
    }

    if ('video' in message && message.video) {
      await context.telegram.sendVideo(chatId, message.video.file_id, {
        message_thread_id: topicId,
      });
    }

    if ('audio' in message && message.audio) {
      await context.telegram.sendAudio(chatId, message.audio.file_id, {
        caption: text,
        message_thread_id: topicId,
      });
    }

    if ('voice' in message && message.voice) {
      await context.telegram.sendVoice(chatId, message.voice.file_id, {
        message_thread_id: topicId,
      });
    }

    if (text) {
      await context.telegram.sendMessage(chatId, text, {
        message_thread_id: topicId,
      });
    }
  }

  static isTopicNotFoundError(error: unknown): boolean {
    const errorMessage = JSON.stringify(error);

    return errorMessage.includes(TelegramErrorMessage.TOPIC_NOT_FOUND);
  }
}
