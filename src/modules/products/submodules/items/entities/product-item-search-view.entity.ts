import { ViewEntity, ViewColumn } from 'typeorm';

import { PRODUCT_ITEMS_SEARCH_VIEW_SQL_NAME } from '@/modules/products/submodules/items/constants';
import {
  IProductItemSearchView,
  IProductSpecification,
} from '@/modules/products/submodules/items/types';

@ViewEntity({
  name: PRODUCT_ITEMS_SEARCH_VIEW_SQL_NAME,
  synchronize: false,
})
export class ProductItemSearchViewEntity implements IProductItemSearchView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  description!: string;

  @ViewColumn()
  createdAt!: Date;

  @ViewColumn()
  updatedAt!: Date;

  @ViewColumn()
  price!: number | null;

  @ViewColumn()
  rating!: number | null;

  @ViewColumn()
  specification!: IProductSpecification;

  @ViewColumn()
  productCategoryId!: number;

  @ViewColumn()
  inStockNumber!: number;

  @ViewColumn()
  isArchived!: boolean;

  @ViewColumn()
  productReviewsCount!: number;
}
