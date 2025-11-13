import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { IProductPrice } from '@/modules/products/submodules/items/types';
import { ProductPriceEntity } from '@/modules/products/submodules/reviews/entities';

@Injectable()
export class ProductPricesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(
    productId: number,
    value: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductPrice> {
    const price = await manager.save(
      ProductPriceEntity,
      manager.create(ProductPriceEntity, {
        productItemId: productId,
        value,
        createdAt: new Date(),
      }),
    );

    return price;
  }
}
