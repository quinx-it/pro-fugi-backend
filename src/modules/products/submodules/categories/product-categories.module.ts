import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductCategoriesController } from '@/modules/products/submodules/categories/product-categories.controller';
import { ProductCategoriesService } from '@/modules/products/submodules/categories/product-categories.service';
import { ProductCategoriesRepository } from '@/modules/products/submodules/categories/repositories';
import { ProductCategoryEntity } from '@/modules/products/submodules/reviews/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity]), AuthModule],
  providers: [ProductCategoriesRepository, ProductCategoriesService],
  controllers: [ProductCategoriesController],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
