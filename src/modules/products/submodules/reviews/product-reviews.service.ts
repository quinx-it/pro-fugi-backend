import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { ProductReviewsImagesRepository } from '@/modules/products/submodules/reviews/repositories';
import { ProductReviewsRepository } from '@/modules/products/submodules/reviews/repositories/product-reviews.repository';
import {
  ICreateProductReviewImage,
  IProductReview,
  IProductReviewImage,
} from '@/modules/products/submodules/reviews/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IPaginated,
  IPagination,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: ProductReviewsRepository,
    private readonly imagesRepo: ProductReviewsImagesRepository,
  ) {}

  async findMany(
    productItemId: number,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPaginated<IProductReview>> {
    const productReviews = await this.repo.findMany(
      productItemId,
      undefined,
      pagination,
      manager,
    );

    const totalCount = await this.repo.findCount(
      productItemId,
      undefined,
      manager,
    );

    return PaginationUtil.fromSinglePage(
      productReviews,
      totalCount,
      pagination,
    );
  }

  async findOne(
    itemId: number,
    reviewId: number,
    throwIfNotFound?: false,
    manager?: EntityManager,
  ): Promise<IProductReview | null>;

  async findOne(
    itemId: number,
    reviewId: number,
    throwIfNotFound?: true,
    manager?: EntityManager,
  ): Promise<IProductReview>;

  async findOne(
    productItemId: number,
    productReviewId: number,
    throwIfNotFound: boolean = true,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductReview | null> {
    const productReview = throwIfNotFound
      ? await this.repo.findOne(productReviewId, true, manager)
      : await this.repo.findOne(productReviewId, false, manager);

    if (productReview?.productItemId !== productItemId) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Product review',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return productReview;
  }

  async createOne(
    customerRoleId: number,
    productItemId: number,
    rating: number,
    text: string | null,
    images: ICreateProductReviewImage[],
  ): Promise<IProductReview> {
    const result = await this.dataSource.transaction(async (manager) => {
      const existingReviewsCount = await this.repo.findCount(
        productItemId,
        customerRoleId,
        manager,
      );

      if (existingReviewsCount) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_REVIEWS_ALREADY_EXISTS_FOR_ITEM,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { id: productReviewId } = await this.repo.createOne(
        productItemId,
        customerRoleId,
        rating,
        text,
        manager,
      );

      await this.imagesRepo.createMany(productReviewId, images, manager);

      const productReview = await this.repo.findOne(
        productReviewId,
        true,
        manager,
      );

      return productReview;
    });

    return result;
  }

  async updateOne(
    customerRoleId: number,
    productItemId: number,
    reviewId: number,
    rating?: number,
    text?: string | null,
    images?: ICreateProductReviewImage[],
  ): Promise<IProductReview> {
    const result = await this.dataSource.transaction(async (manager) => {
      const productReview = await this.findOne(
        productItemId,
        reviewId,
        true,
        manager,
      );

      const { id: reviewCustomerRoleId } = DbUtil.getRelatedEntityOrThrow<
        IProductReview,
        IAuthCustomerRole
      >(productReview, 'authCustomerRole');

      const existingImages = DbUtil.getRelatedEntityOrThrow<
        IProductReview,
        IProductReviewImage[]
      >(productReview, 'productReviewImages');

      if (customerRoleId !== reviewCustomerRoleId) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_REVIEW_CUSTOMER_ID_MISMATCH,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (images !== undefined) {
        await this.imagesRepo.destroyMany(
          existingImages.map((existingImage) => existingImage.id),
          manager,
        );
        await this.imagesRepo.createMany(reviewId, images, manager);
      }

      const productReviewUpdated = await this.repo.updateOne(
        reviewId,
        rating,
        text,
        manager,
      );

      return productReviewUpdated;
    });

    return result;
  }

  async destroyOne(
    customerRoleId: number,
    productItemId: number,
    productReviewId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    const { authCustomerRoleId: reviewCustomerRoleId } = await this.findOne(
      productItemId,
      productReviewId,
      true,
      manager,
    );

    if (customerRoleId !== reviewCustomerRoleId) {
      throw new AppException(
        ERROR_MESSAGES.PRODUCT_REVIEW_CUSTOMER_ID_MISMATCH,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.repo.destroyOne(productReviewId, manager);
  }
}
