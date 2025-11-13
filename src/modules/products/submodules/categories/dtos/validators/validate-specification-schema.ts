import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ProductSpecificationSchemaUtil } from '@/modules/products/submodules/categories/utils/product-specification-schema.util';
import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';

@ValidatorConstraint({ name: 'ValidSpecificationSchema', async: false })
export class ValidSpecificationSchemaConstraint
  implements ValidatorConstraintInterface
{
  validate(schema: IProductSpecificationSchemaAttribute[]): boolean {
    if (!Array.isArray(schema)) {
      return false;
    }

    return ProductSpecificationSchemaUtil.validateMany(schema, true);
  }

  defaultMessage(): string {
    return 'Product specification schema is invalid. Check for duplicate names or conflicting range/enum definitions.';
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
