import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductOrderItemEntity } from '@/modules/products/submodules/orders/entities';
import { IProductOrderItem } from '@/modules/products/submodules/orders/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class ProductOrderItemsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findMany(
    productOrderId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrderItem[]> {
    const productOrderItems = await manager.find(ProductOrderItemEntity, {
      where: { productOrderId },
    });

    return productOrderItems;
  }

  async findOne(
    productOrderItemId: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IProductOrderItem>;

  async findOne(
    productOrderItemId: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductOrderItem | null>;

  async findOne(
    productOrderItemId: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrderItem | null> {
    const productOrderItem = await manager.findOne(ProductOrderItemEntity, {
      where: { id: productOrderItemId },
    });

    if (!productOrderItem) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Product order item',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return productOrderItem;
  }

  async createOne(
    productOrderId: number,
    productItemId: number,
    count: number,
    perItemPrice: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrderItem> {
    const orderItem = await manager.save(ProductOrderItemEntity, {
      productOrderId,
      productItemId,
      count,
      pricePerProductItem: perItemPrice,
    });

    return orderItem;
  }

  async updateOne(
    productOrderItemId: number,
    productOrderId?: number,
    productItemId?: number,
    count?: number,
    perItemPrice?: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrderItem> {
    if (
      !(
        productOrderId === undefined &&
        productItemId === undefined &&
        count === undefined &&
        perItemPrice === undefined
      )
    ) {
      await manager.update(ProductOrderItemEntity, productOrderItemId, {
        productOrderId,
        productItemId,
        pricePerProductItem: perItemPrice,
        count,
      });
    }

    const orderItem = await this.findOne(productOrderItemId, true, manager);

    return orderItem;
  }

  async destroyMany(
    productOrderItemIds: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    if (!productOrderItemIds.length) {
      return 0;
    }

    const { affected } = await manager.delete(
      ProductOrderItemEntity,
      productOrderItemIds,
    );

    return affected || 0;
  }
}
