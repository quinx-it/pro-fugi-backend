import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { ProductImageType } from '@/modules/products/submodules/items/constants';
import { IProductOrderItem } from '@/modules/products/submodules/orders/types';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { IIdentifiable } from '@/shared';

export type IProductSpecificationValue = number | string;
export type IProductSpecification = Record<string, IProductSpecificationValue>;

export interface ICreateProductImage {
  fileName: string;
  type: ProductImageType;
}

export interface ICreateProductItem {
  name: string;
  description: string;
  price: number;
  inStockNumber: number;
  specification: IProductSpecification;
  productCategory: IIdentifiable;
  isArchived: boolean;
  productImages: ICreateProductImage[];
}

export interface IProductItem {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  price: number | null;
  rating: number | null;
  inStockNumber: number;
  isArchived: boolean;
  specification: IProductSpecification;

  productCategory?: IProductCategory;
  productCategoryId: number;

  productOrders?: IProductOrderItem[];

  // eslint-disable-next-line no-use-before-define
  productImages?: IProductImage[];

  // eslint-disable-next-line no-use-before-define
  productPrices?: IProductPrice[];

  // eslint-disable-next-line no-use-before-define
  productReviews?: IProductReview[];
}

export interface IProductItemSearchView {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  price: number | null;
  rating: number | null;
  inStockNumber: number;
  productReviewsCount: number;
  productCategoryId: number;
  specification: IProductSpecification;
  isArchived: boolean;
}

export interface IProductPrice {
  id: number;
  value: number;
  createdAt: Date;

  productItemId: number;
  productItem?: IProductItem;
}

export interface IProductImage {
  id: number;
  fileName: string;
  type: ProductImageType;

  productItemId: number;
  productItem?: IProductItem;
}
