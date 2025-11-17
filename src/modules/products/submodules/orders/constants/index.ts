import { IProductOrdersSearchView } from '@/modules/products/submodules/orders/types';

export enum ProductOrderStatus {
  PROCESSING = 'processing',
  READY_FOR_SHIPPING = 'readyForShipment',
  ON_THE_WAY = 'onTheWay',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProductOrderDeliveryType {
  PICK_UP = 'pickUp',
  SHIPPING = 'shipping',
}

export const PRODUCT_ORDERS_SEARCH_VIEW_SQL_NAME = 'product_orders_search_view';

export enum ProductDiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export const ProductDiscountValuePostfix = {
  [ProductDiscountType.PERCENTAGE]: '%',
  [ProductDiscountType.FIXED]: 'BYN',
};

export const PRODUCT_ORDERS_CUSTOMER_QUERY_SORT = {
  sortBy: 'createdAt' as keyof IProductOrdersSearchView,
  descending: true,
};

export const PRODUCT_ORDERS_CUSTOMER_QUERY_PAGINATION = {
  page: 0,
  limit: 5,
  offset: 0,
};
