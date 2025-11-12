import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { IProductItem } from '@/modules/products/submodules/items/types';

export interface IProductReview {
  id: number;
  rating: number;
  text: string | null;

  productItem?: IProductItem;
  productItemId: number;

  // eslint-disable-next-line no-use-before-define
  productReviewImages?: IProductReviewImage[];

  authCustomerRole?: IAuthCustomerRole;
  authCustomerRoleId: number;
}

export interface ICreateProductReviewImage {
  fileName: string;
}

export interface IProductReviewImage {
  id: number;
  fileName: string;

  productReviewId: number;
  productReview?: IProductReview;
}

export interface ICreateProductReview {
  rating: number;
  text: string | null;

  productReviewImages: ICreateProductReviewImage[];
}
