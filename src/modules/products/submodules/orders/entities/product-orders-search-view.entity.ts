import { ViewColumn, ViewEntity } from 'typeorm';

import {
  PRODUCT_ORDERS_SEARCH_VIEW_SQL_NAME,
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IProductOrdersSearchView } from '@/modules/products/submodules/orders/types';

@ViewEntity({
  name: PRODUCT_ORDERS_SEARCH_VIEW_SQL_NAME,
  synchronize: false,
})
export class ProductOrdersSearchViewEntity implements IProductOrdersSearchView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  address!: string;

  @ViewColumn()
  phone!: string;

  @ViewColumn()
  authCustomerRoleId!: number;

  @ViewColumn()
  productItemIds!: number[];

  @ViewColumn()
  authCustomerRoleName!: string;

  @ViewColumn()
  productItemNames!: string[];

  @ViewColumn()
  status!: ProductOrderStatus;

  @ViewColumn()
  deliveryType!: ProductOrderDeliveryType;

  @ViewColumn()
  totalPrice!: number;

  @ViewColumn()
  productItemsPrice!: number;

  @ViewColumn()
  deliveryPrice!: number;

  @ViewColumn()
  manualPriceAdjustment!: number;

  @ViewColumn()
  createdAt!: Date;

  @ViewColumn()
  discountValue!: number;

  @ViewColumn()
  discountPercentage!: number;
}
