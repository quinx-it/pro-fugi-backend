import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoriesRepository } from '@/modules/products/submodules/categories/repositories';
import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';
import { IPaginated, IPagination, PaginationUtil } from '@/shared';

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
    specificationSchema: IProductSpecificationSchemaAttribute[],
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
    specificationSchema?: IProductSpecificationSchemaAttribute[],
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
}
