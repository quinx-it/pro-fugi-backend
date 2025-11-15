import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { IProductSpecificationSchema } from '@/modules/products/submodules/categories/types';
import { ProductSpecificationSchemaUtil } from '@/modules/products/submodules/categories/utils/product-specification-schema.util';
import { ERROR_MESSAGES } from '@/shared';

@ValidatorConstraint({ name: 'ValidSpecificationSchema', async: false })
export class ValidSpecificationSchemaConstraint
  implements ValidatorConstraintInterface
{
  validate(schema: IProductSpecificationSchema): boolean {
    return ProductSpecificationSchemaUtil.validateMany(schema, true);
  }

  defaultMessage(): string {
    return ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_VALUE_INVALID;
  }
}

export function ValidSpecificationSchema(
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidSpecificationSchemaConstraint,
    });
  };
}
