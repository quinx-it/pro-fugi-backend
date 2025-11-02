import { HttpStatus } from '@nestjs/common';
import { isInstance } from 'class-validator';

import { Template } from '@/shared/utils/template';

interface ITemplateData<TTemplateArgs extends object = object> {
  templateString: string;
  templateArgs: TTemplateArgs;
}

export class AppException<TData extends object = object> extends Error {
  readonly statusCode: number;

  readonly data: TData | null;

  constructor(
    message: string | null = null,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    data: TData | null = null,
  ) {
    super(message || undefined);

    this.statusCode = statusCode;
    this.data = data;
  }

  static fromTemplate<TTemplateArgs extends object = object>(
    template: Template<TTemplateArgs>,
    templateArgs: TTemplateArgs,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): AppException<ITemplateData<TTemplateArgs>> {
    const message = template.execute(templateArgs);

    const { templateString } = template;

    const data = { templateString, templateArgs };

    const exception = new AppException(message, statusCode, data);

    return exception;
  }

  static toValueArgs(value: unknown): { value: string } {
    return { value: JSON.stringify(value) };
  }

  static rethrowAsInternalServerError(value: unknown): void {
    if (isInstance(value, AppException)) {
      const { data, message } = value as AppException;

      throw new AppException(message, HttpStatus.INTERNAL_SERVER_ERROR, data);
    }
  }
}
