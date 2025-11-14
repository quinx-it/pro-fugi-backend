import { HttpStatus } from '@nestjs/common';

import { IProductSpecificationSchema } from '@/modules/products/submodules/categories/types';
import {
  IProductSpecification,
  IProductSpecificationValue,
} from '@/modules/products/submodules/items/types';
import { AppException, ERROR_MESSAGES, IRange, RangeUtil } from '@/shared';

class ProductSpecificationUtil {
  static validateMany(
    schema: IProductSpecificationSchema,
    specification: IProductSpecification,
    requireAllKeys: boolean,
    allowNotSpecifiedKeys: boolean,
    throwIfInvalid: boolean,
  ): boolean {
    if (requireAllKeys) {
      const schemaKeys = Object.keys(schema);
      const specsKeys = Object.keys(specification);

      const missingKeys = schemaKeys.map((schemaKey) =>
        !specsKeys.includes(schemaKey) ? schemaKey : undefined,
      );

      const [missingKey] = missingKeys;

      if (missingKey) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_KEY_ABSENT,
            { key: missingKey },
            HttpStatus.BAD_REQUEST,
          );
        }

        return false;
      }
    }

    return Object.entries(specification)
      .map(([key, value]) =>
        ProductSpecificationUtil.validateOne(
          schema,
          key,
          value,
          allowNotSpecifiedKeys,
          throwIfInvalid,
        ),
      )
      .every((item) => item);
  }

  static validateOne(
    schema: IProductSpecificationSchema,
    specificationKey: string,
    specificationValue: IProductSpecificationValue,
    allowNotSpecified: boolean,
    throwIfInvalid: boolean,
  ): boolean {
    const schemaKeys = Object.keys(schema).filter(
      (schemaKey) => schemaKey === specificationKey,
    );

    if (schemaKeys.length > 1) {
      throw new AppException(
        ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_ITEM_NAME_DUPLICATES,
      );
    }

    if (schemaKeys.length === 0) {
      if (!allowNotSpecified) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_SPECS_KEY_NOT_ALLOWED_BY_SCHEMA_TEMPLATE,
            { value: specificationKey },
            HttpStatus.BAD_REQUEST,
          );
        }

        return false;
      }

      return true;
    }

    const [schemaKey] = schemaKeys;
    const schemaValue = schema[schemaKey];

    const typeOfValue = typeof specificationValue;

    if (RangeUtil.isRange(schemaValue)) {
      if (typeOfValue !== 'number') {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.TYPE_MISMATCH_TEMPLATE,
            {
              value: 'range specification value',
              expectedType: 'number',
              actualType: typeOfValue,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const { min, max } = schemaValue as Partial<IRange<number>>;

      if (min && (specificationValue as number) < min) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.MUST_BE_GREATER_OR_EQUAL_TEMPLATE,
            { key: specificationKey, value: min.toString() },
          );
        }

        return false;
      }

      if (max && (specificationValue as number) > max) {
        if (throwIfInvalid) {
          if (throwIfInvalid) {
            throw AppException.fromTemplate(
              ERROR_MESSAGES.MUST_BE_LESS_OR_EQUAL_TEMPLATE,
              { key: specificationKey, value: max.toString() },
            );
          }
        }

        return false;
      }
    }

    if (Array.isArray(schemaValue)) {
      if (typeOfValue !== 'string') {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.TYPE_MISMATCH_TEMPLATE,
            {
              value: 'enumeration specification value',
              expectedType: 'string',
              actualType: typeOfValue,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        return false;
      }

      if (!schemaValue.includes(specificationValue as string)) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(ERROR_MESSAGES.MUST_BE_IN_TEMPLATE, {
            value: specificationKey.toString(),
            list: schemaValue.join(', '),
          });
        }

        return false;
      }
    }

    return true;
  }
}

export default ProductSpecificationUtil;
