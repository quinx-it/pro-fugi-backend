import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductItemsModule } from '@/modules/products/submodules';
import {
  ProductOrderItemEntity,
  ProductOrdersSearchViewEntity,
  ProductOrderEntity,
} from '@/modules/products/submodules/orders/entities';
import { ProductOrderAddressEntity } from '@/modules/products/submodules/orders/entities/product-order-address.entity';
import { ProductOrdersController } from '@/modules/products/submodules/orders/product-orders.controller';
import { ProductOrdersService } from '@/modules/products/submodules/orders/product-orders.service';
import { ProductOrderAddressesRepository } from '@/modules/products/submodules/orders/repositories/product-order-addresses.repository';
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
      ProductOrderAddressEntity,
    ]),
  ],
  providers: [
    ProductOrderItemsRepository,
    ProductOrdersService,
    ProductOrdersRepository,
    ProductOrderAddressesRepository,
  ],
  controllers: [ProductOrdersController],
})
export class ProductOrdersModule {}
