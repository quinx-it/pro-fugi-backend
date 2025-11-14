import { IProductItem } from '@/modules/products/submodules/items/types';
import { IRange } from '@/shared';

export type IProductSpecificationSchemaValue =
  | null
  | Partial<IRange<number>>
  | string[];

export type IProductSpecificationSchema = Record<
  string,
  IProductSpecificationSchemaValue
>;

export interface ICreateProductCategory {
  name: string;
  specificationSchema: IProductSpecificationSchema;
}

export interface IReplaceProductCategory extends ICreateProductCategory {
  isArchived: boolean;
}

export interface IProductCategory {
  id: number;
  name: string;

  specificationSchema: IProductSpecificationSchema;
  productItems?: IProductItem[];

  isArchived: boolean;
}
