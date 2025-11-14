import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoryEntity } from '@/modules/products/submodules/categories/entities/product-category.entity';
import {
  IProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';
import { AppException, DbUtil, ERROR_MESSAGES, IPagination } from '@/shared';

@Injectable()
export class ProductCategoriesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findMany(
    isArchived?: boolean,
    pagination?: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCategory[]> {
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const productCategories = await manager.find(ProductCategoryEntity, {
      where: { isArchived },
      take,
      skip,
    });

    return productCategories;
  }

  async findCount(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = manager.count(ProductCategoryEntity);

    return count;
  }

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductCategory | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IProductCategory>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCategory | null> {
    const productCategory = await manager.findOne(ProductCategoryEntity, {
      where: { id },
    });

    if (!productCategory && throwIfNotFound) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
        { value: 'Product category' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return productCategory;
  }

  async createOne(
    name: string,
    specificationSchema: IProductSpecificationSchema,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCategory> {
    const productCategory = await manager.save(
      ProductCategoryEntity,
      manager.create(ProductCategoryEntity, {
        name,
        specificationSchema,
      }),
    );

    return productCategory;
  }

  async updateOne(
    productCategoryId: number,
    name?: string,
    specificationSchema?: IProductSpecificationSchema,
    isArchived?: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCategory> {
    if (
      name !== undefined ||
      specificationSchema !== undefined ||
      isArchived !== undefined
    ) {
      await manager.update(ProductCategoryEntity, productCategoryId, {
        name,
        specificationSchema,
        isArchived,
      });
    }

    const productCategory = await this.findOne(
      productCategoryId,
      true,
      manager,
    );

    return productCategory;
  }

  async destroyOne(
    productCategoryId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(ProductCategoryEntity, productCategoryId);
  }
}
