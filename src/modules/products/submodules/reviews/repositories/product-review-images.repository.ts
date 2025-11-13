import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import { ProductReviewImageEntity } from '@/modules/products/submodules/reviews/entities/product-review-image.entity';
import {
  ICreateProductReviewImage,
  IProductReviewImage,
} from '@/modules/products/submodules/reviews/types';

@Injectable()
export class ProductReviewsImagesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createMany(
    productReviewId: number,
    images: ICreateProductReviewImage[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReviewImage[]> {
    const savedImages = await manager.save(
      ProductReviewImageEntity,
      images.map((image) =>
        manager.create(ProductReviewImageEntity, {
          productReviewId,
          ...image,
        }),
      ),
    );

    return savedImages;
  }

  async destroyMany(
    productReviewIds: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    if (!productReviewIds.length) {
      return 0;
    }

    const { affected } = await manager.delete(
      ProductReviewImageEntity,
      productReviewIds,
    );

    return affected || 0;
  }
}
