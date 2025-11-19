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
  basePrice: number;
  discountValue: number | null;
  discountPercentage: number | null;
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
  basePrice: number;
  discountValue: number | null;
  discountPercentage: number | null;
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
  productReviews?: IProductReview[];
}

export interface IProductItemSearchView {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  basePrice: number;
  discountValue: number | null;
  discountPercentage: number | null;
  price: number;
  rating: number | null;
  inStockNumber: number;
  productReviewsCount: number;
  productCategoryId: number;
  specification: IProductSpecification;
  isArchived: boolean;
  popularity: number;
}

export interface IProductImage {
  id: number;
  fileName: string;
  type: ProductImageType;

  productItemId: number;
  productItem?: IProductItem;
}
