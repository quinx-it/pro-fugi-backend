import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsNumberOrString =
  (validationOptions?: ValidationOptions): PropertyDecorator =>
  (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'isNumberOrString',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate: (value: unknown): boolean =>
          typeof value === 'number' || typeof value === 'string',
        defaultMessage: (args: ValidationArguments): string =>
          `${args.property} must be either a number or a string`,
      },
    });
  };
