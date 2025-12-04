import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductItemsModule } from '@/modules/products/submodules';
import { ProductCategoriesController } from '@/modules/products/submodules/categories/product-categories.controller';
import { ProductCategoriesService } from '@/modules/products/submodules/categories/product-categories.service';
import { ProductCategoriesRepository } from '@/modules/products/submodules/categories/repositories';
import { ProductCategoryEntity } from '@/modules/products/submodules/reviews/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCategoryEntity]),
    forwardRef(() => ProductItemsModule),
    AuthModule,
  ],
  providers: [ProductCategoriesRepository, ProductCategoriesService],
  controllers: [ProductCategoriesController],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
