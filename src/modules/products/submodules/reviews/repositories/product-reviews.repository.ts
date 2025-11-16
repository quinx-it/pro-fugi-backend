import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductReviewEntity } from '@/modules/products/submodules/reviews/entities';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { AppException, DbUtil, ERROR_MESSAGES, IPagination } from '@/shared';

@Injectable()
export class ProductReviewsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findMany(
    itemId?: number,
    customerRoleId?: number,
    pagination?: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReview[]> {
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const productReviews = await manager.find(ProductReviewEntity, {
      where: { productItemId: itemId, authCustomerRoleId: customerRoleId },
      take,
      skip,
      relations: ['productReviewImages', 'authCustomerRole'],
    });

    return productReviews;
  }

  async findCount(
    itemId?: number,
    customerRoleId?: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = manager.count(ProductReviewEntity, {
      where: { productItemId: itemId, authCustomerRoleId: customerRoleId },
    });

    return count;
  }

  async findOne(
    id: number,
    throwIfNotFound?: false,
    manager?: EntityManager,
  ): Promise<IProductReview | null>;

  async findOne(
    id: number,
    throwIfNotFound?: true,
    manager?: EntityManager,
  ): Promise<IProductReview>;

  async findOne(
    id: number,
    throwIfNotFound: boolean = true,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReview | null> {
    const productReview = await manager.findOne(ProductReviewEntity, {
      where: { id },
      relations: ['productReviewImages', 'authCustomerRole'],
    });

    if (!productReview && throwIfNotFound) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
        {
          value: 'Product review',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return productReview;
  }

  async createOne(
    itemId: number,
    customerRoleId: number,
    rating: number,
    text: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReview> {
    const { id: productReviewId } = await manager.save(
      ProductReviewEntity,
      manager.create(ProductReviewEntity, {
        productItemId: itemId,
        authCustomerRoleId: customerRoleId,
        rating,
        text,
      }),
    );

    const productReview = await this.findOne(productReviewId, true, manager);

    return productReview;
  }

  async updateOne(
    id: number,
    rating?: number,
    text?: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReview> {
    if (rating !== undefined || text !== undefined) {
      await manager.update(ProductReviewEntity, id, {
        rating,
        text,
      });
    }

    const productReview = await this.findOne(id, true, manager);

    return productReview;
  }

  async destroyOne(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(ProductReviewEntity, id);
  }
}
