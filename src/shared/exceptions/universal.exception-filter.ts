import {
  type ArgumentsHost,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { type Response } from 'express';

import { ContextTypeExtended } from '@/shared';
import { ExceptionDto } from '@/shared/dtos/exception.dto';

export class UniversalExceptionFilter implements ExceptionFilter {
  private static logger = new Logger(UniversalExceptionFilter.name);

  catch(exception: unknown, host?: ArgumentsHost): void {
    if (host) {
      const contextType = host.getType() as ContextTypeExtended;

      if (contextType === ContextTypeExtended.HTTP) {
        const httpResponse = host.switchToHttp().getResponse<Response>();

        UniversalExceptionFilter.handleHttp(exception, httpResponse);
      } else {
        UniversalExceptionFilter.handleBackground(exception, false);
      }
    } else {
      UniversalExceptionFilter.handleBackground(exception, false);
    }
  }

  static handleHttp(exception: unknown, response: Response): void {
    const exceptionDto = ExceptionDto.fromUnknown(exception);

    const { statusCode } = exceptionDto;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      UniversalExceptionFilter.logError(exception, exceptionDto);
    }

    response.status(statusCode).json(exceptionDto);
  }

  static handleBackground(exception: unknown, rethrow: boolean = false): void {
    const exceptionDto = ExceptionDto.fromUnknown(exception);

    UniversalExceptionFilter.logError(exception, exceptionDto);

    if (rethrow) {
      throw rethrow;
    }
  }

  private static logError(exception: unknown, data: ExceptionDto): void {
    const { message, error } = data;

    let stack: string | undefined;

    if (typeof exception === 'object' && exception && 'stack' in exception) {
      const { stack: rawStack } = exception;

      if (typeof rawStack === 'string') {
        stack = rawStack;
      } else {
        stack = JSON.stringify(rawStack);
      }
    }

    if (message) {
      UniversalExceptionFilter.logger.error(message, stack);
    } else {
      UniversalExceptionFilter.logger.error(JSON.stringify(error), stack);
    }
  }
}
