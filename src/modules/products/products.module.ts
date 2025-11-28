import { Module } from '@nestjs/common';

import {
  ProductCategoriesModule,
  ProductGroupsModule,
  ProductFavouritesModule,
  ProductItemsModule,
  ProductOrdersModule,
  ProductReviewsModule,
} from '@/modules/products/submodules';

@Module({
  imports: [
    ProductItemsModule,
    ProductCategoriesModule,
    ProductGroupsModule,
    ProductReviewsModule,
    ProductOrdersModule,
    ProductFavouritesModule,
  ],
})
export class ProductsModule {}
