import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';

import { MulterUtil } from '@/shared/utils/multer.util';

@ValidatorConstraint({ name: 'isFileLocated', async: false })
export class IsFileLocatedConstraint implements ValidatorConstraintInterface {
  validate(fileName: unknown, args: ValidationArguments): boolean {
    if (typeof fileName !== 'string') {
      return false;
    }

    const [dirName] = args.constraints;

    return MulterUtil.isLocated(dirName, fileName, true);
  }

  defaultMessage(args: ValidationArguments): string {
    const [dirName] = args.constraints;

    return `File "${args.value}" is not located in the directory "${dirName}" or does not exist`;
  }
}

export function IsFileLocated(
  dirName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isFileLocated',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [dirName],
      validator: IsFileLocatedConstraint,
    });
  };
}
