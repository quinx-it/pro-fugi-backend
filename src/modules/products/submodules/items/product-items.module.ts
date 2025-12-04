import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductOrdersModule } from '@/modules/products/submodules';
import { ProductCategoriesModule } from '@/modules/products/submodules/categories/product-categories.module';
import { ProductGroupsModule } from '@/modules/products/submodules/groups';
import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import { ProductItemsController } from '@/modules/products/submodules/items/product-items.controller';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import { ProductImagesRepository } from '@/modules/products/submodules/items/repositories';
import { ProductItemsRepository } from '@/modules/products/submodules/items/repositories/product-items.repository';
import { ProductItemSearchViewEntity } from '@/modules/products/submodules/reviews/entities';
import { SERVE_STATIC_OPTIONS } from '@/shared';
import { MulterUtil } from '@/shared/utils/multer.util';

const { rootPath } = SERVE_STATIC_OPTIONS;

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductItemEntity,
      ProductItemSearchViewEntity,
      ProductImageEntity,
    ]),
    forwardRef(() => ProductCategoriesModule),
    forwardRef(() => ProductGroupsModule),
    forwardRef(() => ProductOrdersModule),
    AuthModule,
    MulterUtil.getModule(rootPath, 'images/products/items'),
  ],
  providers: [
    ProductItemsRepository,
    ProductItemsService,
    ProductImagesRepository,
  ],
  controllers: [ProductItemsController],
  exports: [ProductItemsService],
})
export class ProductItemsModule {}
