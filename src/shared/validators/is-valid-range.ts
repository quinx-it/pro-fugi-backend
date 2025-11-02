import { HttpStatus } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

import { AppException, ERROR_MESSAGES } from '@/shared';

@ValidatorConstraint({ name: 'RangeConstraint', async: false })
export class IsValidRangeConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const [maxField, minField, isOptional] = args.constraints as [
      string,
      string,
      boolean,
    ];
    const object = args.object as Record<string, unknown>;

    const maxValue = object[maxField];
    const minValue = object[minField];

    if (maxValue !== undefined && typeof maxValue !== 'number') {
      throw AppException.fromTemplate(ERROR_MESSAGES.TYPE_MISMATCH_TEMPLATE, {
        value: 'combinationSizeMax',
        expectedType: 'number',
        actualType: typeof maxValue,
      });
    }

    if (minValue !== undefined && typeof minValue !== 'number') {
      throw AppException.fromTemplate(ERROR_MESSAGES.TYPE_MISMATCH_TEMPLATE, {
        value: 'combinationSizeMin',
        expectedType: 'number',
        actualType: typeof minValue,
      });
    }

    if (isOptional || maxValue === undefined || minValue === undefined) {
      if (
        (maxValue !== undefined && minValue === undefined) ||
        (minValue !== undefined && maxValue === undefined)
      ) {
        const missingNames = [
          !minValue ? 'combinationSizeMin' : undefined,
          !maxValue ? 'combinationSizeMax' : undefined,
        ]
          .filter((item) => item)
          .join(', ');

        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_PROVIDED_TEMPLATE,
          {
            value: missingNames,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (maxValue !== undefined && minValue !== undefined) {
      if (maxValue < minValue) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.MUST_BE_GREATER_OR_EQUAL_TEMPLATE,
          { key: maxField, value: minField },
        );
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [maxField, minField] = args.constraints as [string, string];

    return ERROR_MESSAGES.MUST_BE_STRICTLY_GREATER_TEMPLATE.execute({
      key: maxField,
      value: minField,
    });
  }
}

export function IsValidRange(
  minField: string,
  maxField: string,
  isOptional: boolean,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxField, minField, isOptional],
      validator: IsValidRangeConstraint,
    });
  };
}
