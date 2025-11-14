import { HttpStatus } from '@nestjs/common';

import {
  IProductSpecificationAttribute,
  IProductSpecificationSchemaAttribute,
} from '@/modules/products/submodules/items/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

export class ProductSpecificationUtil {
  static validateMany(
    schema: IProductSpecificationSchemaAttribute[],
    specification: IProductSpecificationAttribute[],
    allowNotSpecified: boolean,
    throwIfInvalid: boolean,
  ): boolean {
    return specification
      .map((specificationAttribute) =>
        ProductSpecificationUtil.validateOne(
          schema,
          specificationAttribute,
          allowNotSpecified,
          throwIfInvalid,
        ),
      )
      .every((item) => item);
  }

  static validateOne(
    schema: IProductSpecificationSchemaAttribute[],
    specificationAttribute: IProductSpecificationAttribute,
    allowNotSpecified: boolean,
    throwIfInvalid: boolean,
  ): boolean {
    const { value } = specificationAttribute;

    const schemaAttributes = schema.filter(
      (schemaAttribute) => schemaAttribute.name === specificationAttribute.name,
    );

    if (schemaAttributes.length > 1) {
      throw new AppException(
        ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_ITEM_NAME_DUPLICATES,
      );
    }

    if (schemaAttributes.length === 0) {
      if (!allowNotSpecified) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_SPECS_KEY_NOT_ALLOWED_BY_SCHEMA_TEMPLATE,
            { value: specificationAttribute.name },
            HttpStatus.BAD_REQUEST,
          );
        }

        return false;
      }

      return true;
    }

    const [schemaAttribute] = schemaAttributes;

    const { range, enumeration, name } = schemaAttribute;

    if (range !== null && enumeration !== null) {
      if (throwIfInvalid) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_SPECS_SCHEMA_ITEM_CANNOT_HAVE_BOTH_ENUM_AND_RANGE,
        );
      }
    }

    const typeOfValue = typeof value;

    if (range !== null) {
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

      const { min, max } = range;

      if (min && (value as number) < min) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.MUST_BE_GREATER_OR_EQUAL_TEMPLATE,
            { key: name, value: min.toString() },
          );
        }

        return false;
      }

      if (max && (value as number) > max) {
        if (throwIfInvalid) {
          if (throwIfInvalid) {
            throw AppException.fromTemplate(
              ERROR_MESSAGES.MUST_BE_LESS_OR_EQUAL_TEMPLATE,
              { key: name, value: max.toString() },
            );
          }
        }

        return false;
      }
    }

    if (enumeration !== null) {
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

      if (!enumeration.includes(value as string)) {
        if (throwIfInvalid) {
          throw AppException.fromTemplate(ERROR_MESSAGES.MUST_BE_IN_TEMPLATE, {
            value: value.toString(),
            list: enumeration.join(', '),
          });
        }

        return false;
      }
    }

    return true;
  }
}
