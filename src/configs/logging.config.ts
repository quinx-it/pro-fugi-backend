import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  type WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { APP_ENV } from '@/configs/env';
import {
  AppEnvironment,
  DOCS,
  IGNORED_CONTEXTS,
  LEVELS_ALLOWED_FOR_IGNORED,
  NestLoggingLevel,
  WinstonLoggingLevel,
} from '@/shared';

import type { LoggerService } from '@nestjs/common';

const routerResolverFilter = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    const { context, level } = info;

    if (
      typeof context === 'string' &&
      IGNORED_CONTEXTS.includes(context) &&
      !LEVELS_ALLOWED_FOR_IGNORED.includes(level as NestLoggingLevel)
    ) {
      return false;
    }

    if (
      typeof context === 'object' &&
      context !== null &&
      'toString' in context &&
      typeof context.toString === 'function' &&
      IGNORED_CONTEXTS.includes(context.toString()) &&
      !LEVELS_ALLOWED_FOR_IGNORED.includes(level as NestLoggingLevel)
    ) {
      return false;
    }

    return info;
  },
);

const dailyOptions = {
  datePattern: 'YYYY-MM-DD',
  dirname: `./logs/`,
  filename: `%DATE%.log`,
  zippedArchive: true,
  json: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.json(),
    routerResolverFilter(),
  ),
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike(DOCS.PROJECT_NAME_NEST_LIKE, {
      colors: true,
      prettyPrint: true,
    }),
    routerResolverFilter(),
  ),
});

const fileTransport = new DailyRotateFile(dailyOptions);

const transports = [consoleTransport, fileTransport];

export const loggingConfigs: WinstonModuleOptions = {
  level:
    APP_ENV === AppEnvironment.PRODUCTION
      ? WinstonLoggingLevel.INFO
      : WinstonLoggingLevel.SILLY,
  transports,
};

export class LoggerUtil {
  static get(): LoggerService {
    return WinstonModule.createLogger(loggingConfigs);
  }
}
