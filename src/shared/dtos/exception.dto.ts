import { STATUS_CODES } from 'http';
import { inspect } from 'util';

import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ERROR_MESSAGES } from '@/shared/constants';
import { AppException } from '@/shared/exceptions';

export class ExceptionDto<TData extends object = object> {
  @ApiProperty()
  message?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error?: string;

  @ApiProperty()
  data?: TData;

  constructor(
    message: string | null = null,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    data: TData | null = null,
  ) {
    this.statusCode = statusCode;

    const error =
      STATUS_CODES[statusCode] || ERROR_MESSAGES.HTTP_INTERNAL_SERVER_ERROR;

    if (error !== message && message) {
      this.error = error;
    }

    this.message =
      typeof message === 'string' ? message : JSON.stringify(message);

    if (data) {
      this.data = data;
    }
  }

  static fromUnknown(exception: unknown): ExceptionDto {
    let exceptionDto = ExceptionDto.DEFAULT;

    if (exception === null || exception === undefined) {
      return exceptionDto;
    }

    if (typeof exception === 'object') {
      if (exception instanceof AppException) {
        exceptionDto = ExceptionDto.fromApp(exception);
      } else if (exception instanceof HttpException) {
        exceptionDto = ExceptionDto.fromHttp(exception);
      } else {
        exceptionDto = ExceptionDto.fromObject(exception);
      }
    } else if (typeof exception === 'string') {
      exceptionDto = ExceptionDto.fromString(exception);
    }

    return exceptionDto;
  }

  private static fromApp(exception: AppException): ExceptionDto {
    const { message, statusCode, data } = exception;

    return new ExceptionDto(message, statusCode, data);
  }

  private static fromHttp(exception: HttpException): ExceptionDto {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      const statusCode = exception.getStatus();

      return new ExceptionDto(response, statusCode);
    }

    if ('message' in response && 'statusCode' in response) {
      const { message, statusCode } = response;

      if (typeof statusCode === 'number') {
        if (typeof message === 'string') {
          return new ExceptionDto(message, statusCode);
        }

        return new ExceptionDto(inspect(message, true, 10), statusCode);
      }
    }

    return new ExceptionDto();
  }

  private static fromObject(exception: object): ExceptionDto {
    return new ExceptionDto(inspect(exception, true, 10));
  }

  private static fromString(exception: string): ExceptionDto {
    return new ExceptionDto(exception);
  }

  static DEFAULT = new ExceptionDto();
}
