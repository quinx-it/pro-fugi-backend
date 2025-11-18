import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductOrderAddressEntity } from '@/modules/products/submodules/orders/entities/product-order-address.entity';
import { IAddress } from '@/shared';

@Injectable()
export class ProductOrderAddressesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createOne(
    productOrderId: number,
    city: string,
    street: string,
    building: string,
    block: string | null,
    apartment: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAddress> {
    const address = await manager.save(ProductOrderAddressEntity, {
      productOrderId,
      city,
      street,
      block,
      building,
      apartment,
    });

    return address;
  }

  async destroyOne(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(ProductOrderAddressEntity, id);
  }
}
