import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { IProductItem } from '@/modules/products/submodules/items/types';
import {
  ProductDiscountType,
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IIdentifiable } from '@/shared';

export interface IProductOrderItem {
  id: number;

  pricePerProductItem: number;
  totalPrice: number;

  productItem?: IProductItem;
  productItemId: number;

  count: number;

  // eslint-disable-next-line no-use-before-define
  productOrder?: IProductOrder;
  productOrderId: number;
}

export interface ICreateProductOrderItem {
  productItem: IIdentifiable;
  count: number;
}

export interface ICreateProductOrderItemAsAdmin
  extends ICreateProductOrderItem {
  pricePerProductItemIfNotDefault: number | null;
}

export interface IUpdateProductOrderItemAsAdmin {
  pricePerProductItemIfNotDefault?: number | null;
  productItem?: IIdentifiable;
  count?: number;
}

export interface ICreateProductOrder {
  deliveryType: ProductOrderDeliveryType;
  comment: string | null;
  addressIfNotDefault: string | null;
  phoneIfNotDefault: string | null;
  productOrderItems: ICreateProductOrderItem[];
}

export interface ICreateProductOrderAsAdmin extends ICreateProductOrder {
  authCustomerRoleId: number;
  productOrderItems: ICreateProductOrderItemAsAdmin[];
}

export interface IUpdateProductOrderAsAdmin {
  status?: ProductOrderStatus;
  addressIfNotDefault?: string | null;
  deliveryType?: ProductOrderDeliveryType;
  manualPriceAdjustment?: number;
}

export interface IProductOrder {
  id: number;

  authCustomerRole?: IAuthCustomerRole | null;
  authCustomerRoleId: number | null;

  productOrderItems?: IProductOrderItem[];

  address: string | null;
  phone: string;

  status: ProductOrderStatus;
  deliveryType: ProductOrderDeliveryType;
  comment: string | null;

  configShippingPrice: number;
  configFreeShippingThreshold: number;

  productItemsPrice: number;
  deliveryPrice: number;
  discountValue: number;
  discountPercentage: number;
  manualPriceAdjustment: number;
  totalPrice: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IProductOrdersSearchView {
  id: number;

  authCustomerRoleId: number;
  productItemIds: number[];
  authCustomerRoleName: string;
  productItemNames: string[];

  address: string | null;
  phone: string;

  status: ProductOrderStatus;
  deliveryType: ProductOrderDeliveryType;

  productItemsPrice: number;
  deliveryPrice: number;
  discountValue: number;
  discountPercentage: number;
  manualPriceAdjustment: number;
  totalPrice: number;

  createdAt: Date;
}

export type IProductDiscount = {
  value: number;
  type: ProductDiscountType;
};

export type IProductDiscountPolicy = Map<number, IProductDiscount>;

export type IProductCustomerDiscount = {
  discount: IProductDiscount | null;
  totalOrdersSum: number;
  currentThreshold: number | null;
  nextThreshold: number | null;
};
