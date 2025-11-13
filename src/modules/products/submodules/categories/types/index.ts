import {
  IProductItem,
  IProductSpecificationSchemaAttribute,
} from '@/modules/products/submodules/items/types';

export interface ICreateProductCategory {
  name: string;
  specificationSchema: IProductSpecificationSchemaAttribute[];
}

export interface IReplaceProductCategory extends ICreateProductCategory {
  isArchived: boolean;
}

export interface IProductCategory {
  id: number;
  name: string;

  specificationSchema: IProductSpecificationSchemaAttribute[];
  productItems?: IProductItem[];

  isArchived: boolean;
}
