import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import {
  ICreateProductImage,
  IProductImage,
} from '@/modules/products/submodules/items/types';

@Injectable()
export class ProductImagesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createMany(
    itemId: number,
    images: ICreateProductImage[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductImage[]> {
    const savedImages = await manager.save(
      ProductImageEntity,
      images.map((image) =>
        manager.create(ProductImageEntity, { productItemId: itemId, ...image }),
      ),
    );

    return savedImages;
  }

  async destroyMany(
    ids: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    if (!ids.length) {
      return 0;
    }

    const { affected } = await manager.delete(ProductImagesRepository, ids);

    return affected || 0;
  }
}
