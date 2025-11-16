import {
  PRODUCTS_DISCOUNT_POLICY,
  PRODUCTS_FREE_SHIPPING_THRESHOLD,
  PRODUCTS_SHIPPING_PRICE,
} from '@/configs/env';

export const productsConfig = {
  shippingPrice: PRODUCTS_SHIPPING_PRICE,
  freeShippingThreshold: PRODUCTS_FREE_SHIPPING_THRESHOLD,
  discountPolicy: PRODUCTS_DISCOUNT_POLICY,
};
