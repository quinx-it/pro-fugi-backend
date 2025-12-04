import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductGroupEntity } from '@/modules/products/submodules/groups/entities';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { AppException, DbUtil, ERROR_MESSAGES, IPagination } from '@/shared';

@Injectable()
export class ProductGroupsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findMany(
    pagination?: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup[]> {
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const productCategories = await manager.find(ProductGroupEntity, {
      take,
      skip,
      relations: ['productItems', 'productCategory'],
    });

    return productCategories;
  }

  async findCount(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = manager.count(ProductGroupEntity);

    return count;
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
    const productGroup = await manager.findOne(ProductGroupEntity, {
      where: { id },
      relations: ['productItems', 'productCategory'],
    });

    if (!productGroup && throwIfNotFound) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
        { value: 'Product category' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return productGroup;
  }

  async createOne(
    name: string,
    description: string,
    imageFileName: string | null,
    productCategoryId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
    const { id: productGroupId } = await manager.save(
      ProductGroupEntity,
      manager.create(ProductGroupEntity, {
        name,
        description,
        imageFileName,
        productCategoryId,
      }),
    );

    const productGroup = await this.findOne(productGroupId, true, manager);

    return productGroup;
  }

  async updateOne(
    productGroupId: number,
    name?: string,
    description?: string,
    imageFileName?: string | null,
    productCategoryId?: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
    if (
      name !== undefined ||
      description !== undefined ||
      imageFileName !== undefined ||
      productCategoryId !== undefined
    ) {
      await manager.update(ProductGroupEntity, productGroupId, {
        name,
        description,
        imageFileName,
        productCategoryId,
      });
    }

    const productGroup = await this.findOne(productGroupId, true, manager);

    return productGroup;
  }

  async destroyOne(
    productGroupId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(ProductGroupEntity, productGroupId);
  }
}
