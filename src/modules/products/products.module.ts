import { Module } from '@nestjs/common';

import {
  ProductCategoriesModule,
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
  ],
})
export class ProductsModule {}
