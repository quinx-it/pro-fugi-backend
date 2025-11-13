import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';

export class ProductSpecificationSchemaUtil {
  static validateMany(
    schema: IProductSpecificationSchemaAttribute[],
    throwIfInvalid: boolean,
  ): boolean {
    const names = schema.map((schemaAttribute) => schemaAttribute.name);
    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length !== names.length) {
      if (throwIfInvalid) {
        throw new Error('Each schema attr must have a unique name');
      }

      return false;
    }

    return schema
      .map((schemaAttribute: IProductSpecificationSchemaAttribute) =>
        ProductSpecificationSchemaUtil.validateOne(
          schemaAttribute,
          throwIfInvalid,
        ),
      )
      .every((item) => item);
  }

  static validateOne(
    schemaAttribute: IProductSpecificationSchemaAttribute,
    throwIfInvalid: boolean,
  ): boolean {
    const { range, enumeration } = schemaAttribute;

    if (range !== null && enumeration !== null) {
      if (throwIfInvalid) {
        throw new Error('Invalid schema. Cannot have both range and enum');
      }

      return false;
    }

    return true;
  }
}
