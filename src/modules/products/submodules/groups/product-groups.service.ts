import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductGroupsRepository } from '@/modules/products/submodules/groups/repositories/product-groups.repository';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import { IProductItem } from '@/modules/products/submodules/items/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IPaginated,
  IPagination,
  PaginationUtil,
} from '@/shared';
import { PromisesUtil } from '@/shared/utils/promises.util';

@Injectable()
export class ProductGroupsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: ProductGroupsRepository,
    private readonly itemsService: ProductItemsService,
  ) {}

  async findMany(
    pagination: IPagination,
    manager?: EntityManager,
  ): Promise<IPaginated<IProductGroup>> {
    const productGroups = await this.repo.findMany(pagination, manager);

    const totalCount = await this.repo.findCount(manager);

    return PaginationUtil.fromSinglePage(productGroups, totalCount, pagination);
  }

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductGroup | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IProductGroup>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup | null> {
    const productGroup = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return productGroup;
  }

  async createOne(
    name: string,
    description: string,
    imageFileName: string | null,
    productCategoryId: number,
    productItemIds: number[],
    manager?: EntityManager,
  ): Promise<IProductGroup> {
    return manager
      ? this.dataSource.transaction(async (transactionManager) =>
          this.createOneInternal(
            name,
            description,
            imageFileName,
            productCategoryId,
            productItemIds,
            transactionManager,
          ),
        )
      : this.createOneInternal(
          name,
          description,
          imageFileName,
          productCategoryId,
          productItemIds,
          manager,
        );
  }

  async createOneInternal(
    name: string,
    description: string,
    imageFileName: string | null,
    productCategoryId: number,
    productItemIds: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
    const { id: productGroupId } = await this.repo.createOne(
      name,
      description,
      imageFileName,
      productCategoryId,
      manager,
    );

    await PromisesUtil.runSequentially(productItemIds, async (productItemId) =>
      this.itemsService.updateOne(
        productItemId,
        undefined,
        undefined,
        undefined,
        productGroupId,
      ),
    );

    const productGroup = await this.repo.findOne(productGroupId, true, manager);

    return productGroup;
  }

  async updateOne(
    productGroupId: number,
    name?: string,
    description?: string,
    imageFileName?: string | null,
    productItemIds?: number[],
    manager?: EntityManager,
  ): Promise<IProductGroup> {
    return manager
      ? this.dataSource.transaction(async (transactionManager) =>
          this.updateOneInternal(
            productGroupId,
            name,
            description,
            imageFileName,
            productItemIds,
            transactionManager,
          ),
        )
      : this.updateOneInternal(
          productGroupId,
          name,
          description,
          imageFileName,
          productItemIds,
          manager,
        );
  }

  async updateOneInternal(
    productGroupId: number,
    name?: string,
    description?: string,
    imageFileName?: string | null,
    productItemIds?: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
    if (productItemIds) {
      const currentProductGroup = await this.repo.findOne(
        productGroupId,
        true,
        manager,
      );

      const productItems = DbUtil.getRelatedEntityOrThrow<
        IProductGroup,
        IProductItem[]
      >(currentProductGroup, 'productItems');

      const { productCategoryId } = currentProductGroup;

      await PromisesUtil.runSequentially(
        productItems.map((item) => item.id),
        async (productItemId) =>
          this.itemsService.updateOne(
            productItemId,
            undefined,
            undefined,
            undefined,
            undefined,
            null,
          ),
      );

      await PromisesUtil.runSequentially(
        productItemIds,
        async (productItemId) => {
          const { productCategoryId: itemProductCategoryId } =
            await this.itemsService.updateOne(
              productItemId,
              undefined,
              undefined,
              undefined,
              undefined,
              productGroupId,
            );

          if (productCategoryId !== itemProductCategoryId) {
            throw new AppException(
              ERROR_MESSAGES.PRODUCT_GROUP_CATEGORY_MISMATCH,
              HttpStatus.BAD_REQUEST,
            );
          }
        },
      );
    }

    const productGroup = await this.repo.updateOne(
      productGroupId,
      name,
      description,
      imageFileName,
      productGroupId,
      manager,
    );

    return productGroup;
  }

  async destroyOne(
    productGroupId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await this.repo.destroyOne(productGroupId, manager);
  }
}
