import {
  IProductSpecificationAttribute,
  IProductSpecificationSchemaAttribute,
} from '@/modules/products/submodules/items/types';

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
      throw new Error('Multiple found');
    }

    if (schemaAttributes.length === 0) {
      if (!allowNotSpecified) {
        if (throwIfInvalid) {
          throw new Error('Unspecified attribute');
        }

        return false;
      }

      return true;
    }

    const [schemaAttribute] = schemaAttributes;

    const { range, enumeration } = schemaAttribute;

    if (range !== null && enumeration !== null) {
      throw new Error('Invalid schema. Cannot have both range and enum');
    }

    if (range !== null) {
      if (typeof value !== 'number') {
        if (throwIfInvalid) {
          throw new Error(
            'A range specification attribute must be of type number',
          );
        }
      }

      const { min, max } = range;

      if (min && (value as number) < min) {
        if (throwIfInvalid) {
          throw new Error('Invalid range');
        }

        return false;
      }

      if (max && (value as number) > max) {
        if (throwIfInvalid) {
          throw new Error('Invalid range');
        }

        return false;
      }
    }

    if (enumeration !== null) {
      if (typeof value !== 'string') {
        if (throwIfInvalid) {
          throw new Error(
            'An enum specification attribute must be of type string',
          );
        }

        return false;
      }

      if (!enumeration.includes(value as string)) {
        if (throwIfInvalid) {
          throw new Error('Value is not a part of schema enum');
        }

        return false;
      }
    }

    return true;
  }
}
