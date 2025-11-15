import { HttpStatus } from '@nestjs/common';

import { IProductSpecificationSchema } from '@/modules/products/submodules/categories/types';
import { AppException, ERROR_MESSAGES, RangeUtil } from '@/shared';

export class ProductSpecificationSchemaUtil {
  static validateMany(
    schema: IProductSpecificationSchema,
    throwIfInvalid: boolean,
  ): boolean {
    const names = Object.keys(schema);
    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length !== names.length) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_ITEM_NAME_DUPLICATES,
          HttpStatus.BAD_REQUEST,
        );
      }

      return false;
    }

    return Object.values(schema)
      .map((value) =>
        ProductSpecificationSchemaUtil.validateOne(value, throwIfInvalid),
      )
      .every((item) => item);
  }

  static validateOne(value: unknown, throwIfInvalid: boolean): boolean {
    if (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
    ) {
      return true;
    }

    if (RangeUtil.isRange(value)) {
      return true;
    }

    if (value === null) {
      return true;
    }

    if (throwIfInvalid) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_VALUE_INVALID_TEMPLATE,
        { value: JSON.stringify(value) },
        HttpStatus.BAD_REQUEST,
      );
    }

    return false;
  }
}
