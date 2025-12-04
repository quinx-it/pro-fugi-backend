import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoriesRepository } from '@/modules/products/submodules/categories/repositories';
import {
  IProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
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
    @Inject(forwardRef(() => ProductItemsService))
    private readonly productItemsService: ProductItemsService,
  ) {}

  async findMany(
    pagination: IPagination,
    isArchived?: boolean,
    manager: EntityManager = this.dataSource.manager,
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
    manager: EntityManager | null = null,
  ): Promise<IProductCategory> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const productCategory = await this.repo.createOne(
          name,
          specificationSchema,
          transactionManager,
        );

        return productCategory;
      },
      this.dataSource,
      manager,
    );
  }

  async updateOne(
    productCategoryId: number,
    name?: string,
    specificationSchema?: IProductSpecificationSchema,
    isArchived?: boolean,
    manager: EntityManager | null = null,
  ): Promise<IProductCategory> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const productCategory = await this.repo.updateOne(
          productCategoryId,
          name,
          specificationSchema,
          isArchived,
          transactionManager,
        );

        return productCategory;
      },
      this.dataSource,
      manager,
    );
  }

  async destroyOne(
    productCategoryId: number,
    manager: EntityManager | null = null,
  ): Promise<void> {
    await DbUtil.transaction(
      async (transactionManager) => {
        const productItemsCount =
          await this.productItemsService.countByProductCategory(
            productCategoryId,
            transactionManager,
          );

        if (productItemsCount) {
          const { name } = await this.repo.findOne(
            productCategoryId,
            true,
            transactionManager,
          );

          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_CATEGORY_HAS_RELATED_ITEMS_TEMPLATE,
            {
              productCategoryName: name,
              productCategoryId: productCategoryId.toString(),
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.repo.destroyOne(productCategoryId, transactionManager);
      },
      this.dataSource,
      manager,
    );
  }
}
