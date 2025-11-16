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
