import { Module } from '@nestjs/common';

import {
  ProductCategoriesModule,
  ProductFavouritesModule,
  ProductItemsModule,
  ProductOrdersModule,
  ProductReviewsModule,
} from '@/modules/products/submodules';

@Module({
  imports: [
    ProductItemsModule,
    ProductCategoriesModule,
    ProductReviewsModule,
    ProductOrdersModule,
    ProductFavouritesModule,
  ],
})
export class ProductsModule {}
