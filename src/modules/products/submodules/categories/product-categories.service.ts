import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoriesRepository } from '@/modules/products/submodules/categories/repositories';
import {
  IProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IPaginated,
  IPagination,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: ProductCategoriesRepository,
  ) {}

  async findMany(
    pagination: IPagination,
    isArchived?: boolean,
    manager?: EntityManager,
  ): Promise<IPaginated<IProductCategory>> {
    const productCategories = await this.repo.findMany(
      isArchived,
      pagination,
      manager,
    );

    const totalCount = await this.repo.findCount(manager);

    return PaginationUtil.fromSinglePage(
      productCategories,
      totalCount,
      pagination,
    );
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
    const productCategory = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return productCategory;
  }

  async createOne(
    name: string,
    specificationSchema: IProductSpecificationSchema,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCategory> {
    const productCategory = await this.repo.createOne(
      name,
      specificationSchema,
      manager,
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
    const productCategory = await this.repo.updateOne(
      productCategoryId,
      name,
      specificationSchema,
      isArchived,
      manager,
    );

    return productCategory;
  }

  async destroyOne(
    productCategoryId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    try {
      await this.repo.destroyOne(productCategoryId, manager);
    } catch (error) {
      if (DbUtil.isNoActionRelated(error)) {
        const { name: productCategoryName } = await this.repo.findOne(
          productCategoryId,
          true,
        );

        throw AppException.fromTemplate(
          ERROR_MESSAGES.PRODUCT_CATEGORY_HAS_RELATED_ITEMS_TEMPLATE,
          {
            productCategoryName,
            productCategoryId: productCategoryId.toString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }
}
