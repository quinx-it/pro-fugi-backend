import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductItemsModule } from '@/modules/products/submodules';
import {
  ProductOrderItemEntity,
  ProductOrdersSearchViewEntity,
  ProductOrderEntity,
} from '@/modules/products/submodules/orders/entities';
import { ProductOrdersController } from '@/modules/products/submodules/orders/product-orders.controller';
import { ProductOrdersService } from '@/modules/products/submodules/orders/product-orders.service';
import { ProductOrderItemsRepository } from '@/modules/products/submodules/orders/repositories/product-order-items.repository';
import { ProductOrdersRepository } from '@/modules/products/submodules/orders/repositories/product-orders.repository';

@Module({
  imports: [
    AuthModule,
    ProductItemsModule,
    TypeOrmModule.forFeature([
      ProductOrderEntity,
      ProductOrderItemEntity,
      ProductOrdersSearchViewEntity,
    ]),
  ],
  providers: [
    ProductOrderItemsRepository,
    ProductOrdersService,
    ProductOrdersRepository,
  ],
  controllers: [ProductOrdersController],
})
export class ProductOrdersModule {}
