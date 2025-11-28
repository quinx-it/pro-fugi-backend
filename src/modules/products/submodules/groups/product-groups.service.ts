import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductGroupsRepository } from '@/modules/products/submodules/groups/repositories/product-groups.repository';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { IPaginated, IPagination, PaginationUtil } from '@/shared';

@Injectable()
export class ProductGroupsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: ProductGroupsRepository,
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
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
    const productGroup = await this.repo.createOne(
      name,
      description,
      imageFileName,
      productCategoryId,
      manager,
    );

    return productGroup;
  }

  async updateOne(
    productGroupId: number,
    name?: string,
    description?: string,
    imageFileName?: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductGroup> {
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
