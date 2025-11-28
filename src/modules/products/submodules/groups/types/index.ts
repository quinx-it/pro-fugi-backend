import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { IIdentifiable } from '@/shared';

export interface IProductGroup {
  id: number;

  name: string;
  description: string;
  imageFileName: string | null;

  productCategory?: IProductCategory;
  productCategoryId: number;

  productItems?: IProductItem[];
}

export interface ICreateProductGroup {
  name: string;
  description: string;
  imageFileName: string | null;

  productCategory: IIdentifiable;
}

export interface IReplaceProductGroup {
  name: string;
  description: string;
  imageFileName: string | null;
}

export interface IUpdateProductGroup {
  name?: string;
  description?: string;
  imageFileName?: string | null;
}
