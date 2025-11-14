import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  ValidationError,
} from '@nestjs/common';
import { ApiBody, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidateIf } from 'class-validator';

import { GLOBAL_VALIDATION_PIPE_OPTIONS } from '@/shared';

export class DtosUtil {
  static transformCommaSeparatedStringArray({
    value,
  }: {
    value: unknown;
  }): unknown {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }

    return value;
  }

  static transformCommaSeparatedIntArray({
    value,
  }: {
    value: unknown;
  }): unknown {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item, 10));
    }

    return value;
  }

  static async validateUnion<T extends object>(
    payload: unknown,
    candidates: ClassConstructor<T>[],
  ): Promise<{ instance: T; errors: ValidationError[] } | null> {
    // eslint-disable-next-line no-restricted-syntax
    for (const Candidate of candidates) {
      const instance = plainToInstance(Candidate, payload);
      // eslint-disable-next-line no-await-in-loop
      const errors = await validate(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length === 0) {
        return { instance, errors };
      }
    }

    return null;
  }

  static body(
    ...dtoClasses: ClassConstructor<object>[]
  ): ParameterDecorator | PropertyDecorator {
    return createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const { body } = request;

      // eslint-disable-next-line no-restricted-syntax
      for (const dtoClass of dtoClasses) {
        const instance = plainToInstance(dtoClass, body);
        // eslint-disable-next-line no-await-in-loop
        const errors = await validate(instance, GLOBAL_VALIDATION_PIPE_OPTIONS);

        if (errors.length === 0) {
          return instance; // Success: return typed instance
        }
      }

      // Failed all — collect errors for debugging
      const errorMessages = await Promise.all(
        dtoClasses.map(async (DtoClass) => {
          const instance = plainToInstance(DtoClass, body);
          const errors = await validate(instance, { whitelist: true });

          if (errors.length > 0) {
            return `${DtoClass.name}: ${errors
              .map((e) => Object.values(e.constraints || {}).join(', '))
              .join('; ')}`;
          }

          return null;
        }),
      );

      throw new BadRequestException(
        `Validation failed for all schemas: ${errorMessages
          .filter(Boolean)
          .join(' | ')}`,
      );
    })();
  }

  static apiBody(
    ...dtoClasses: ClassConstructor<object>[]
  ): MethodDecorator & ClassDecorator {
    return applyDecorators(
      ApiBody({
        schema: {
          oneOf: dtoClasses.map((dto) => ({ $ref: getSchemaPath(dto) })),
        },
      }),
    );
  }

  static isNullable(): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
      ValidateIf((obj) => obj[propertyKey as string] !== null)(
        target,
        propertyKey,
      );
    };
  }

  static query(
    ...dtoClasses: ClassConstructor<object>[]
  ): ParameterDecorator | PropertyDecorator {
    return createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const { query } = request;

      let validOne: unknown;

      await Promise.all(
        dtoClasses.map(async (dtoClass) => {
          const instance = plainToInstance(dtoClass, query);
          const errors = await validate(
            instance,
            GLOBAL_VALIDATION_PIPE_OPTIONS,
          );

          if (errors.length === 0) {
            validOne = instance;
          }
        }),
      );

      if (validOne) {
        return validOne;
      }

      const errorMessages = await Promise.all(
        dtoClasses.map(async (DtoClass) => {
          const instance = plainToInstance(DtoClass, query);
          const errors = await validate(instance, { whitelist: true });

          if (errors.length > 0) {
            return `${DtoClass.name}: ${errors
              .map((e) => Object.values(e.constraints || {}).join(', '))
              .join('; ')}`;
          }

          return null;
        }),
      );

      throw new BadRequestException(
        `Query validation failed for all schemas: ${errorMessages
          .filter(Boolean)
          .join(' | ')}`,
      );
    })();
  }

  static apiQuery(
    ...dtoClasses: ClassConstructor<object>[]
  ): MethodDecorator & ClassDecorator {
    return applyDecorators(
      ApiQuery({
        schema: {
          oneOf: dtoClasses.map((dto) => ({ $ref: getSchemaPath(dto) })),
        },
      }),
    );
  }
}
