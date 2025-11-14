import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoriesService } from '@/modules/products/submodules/categories/product-categories.service';
import {
  ProductImagesRepository,
  ProductPricesRepository,
} from '@/modules/products/submodules/items/repositories';
import { ProductItemsRepository } from '@/modules/products/submodules/items/repositories/product-items.repository';
import {
  ICreateProductImage,
  IProductImage,
  IProductItem,
  IProductItemSearchView,
  IProductSpecification,
} from '@/modules/products/submodules/items/types';
import ProductSpecificationUtil from '@/modules/products/submodules/items/utils/product-specification.util';
import {
  DbUtil,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class ProductItemsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly itemsRepo: ProductItemsRepository,
    private readonly pricesRepo: ProductPricesRepository,
    private readonly imagesRepo: ProductImagesRepository,
    private readonly categoriesService: ProductCategoriesService,
  ) {}

  async findMany(
    filter: IFilter<IProductItemSearchView>,
    specsFilter: IProductSpecification,
    sort: ISort<IProductItemSearchView>,
    pagination: IPagination,
  ): Promise<IPaginated<IProductItem>> {
    const { items, totalCount } = await this.itemsRepo.findManyAndCount(
      filter,
      specsFilter,
      sort,
      pagination,
    );

    return PaginationUtil.fromSinglePage(items, totalCount, pagination);
  }

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductItem | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IProductItem>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductItem | null> {
    const product = throwIfNotFound
      ? await this.itemsRepo.findOne(id, true, manager)
      : await this.itemsRepo.findOne(id, false, manager);

    return product;
  }

  async createOne(
    title: string,
    description: string,
    specification: IProductSpecification,
    categoryId: number,
    images: ICreateProductImage[],
    priceValue: number,
    inStockNumber: number,
  ): Promise<IProductItem> {
    const result = await this.dataSource.transaction(async (manager) => {
      const { specificationSchema } = await this.categoriesService.findOne(
        categoryId,
        true,
        manager,
      );

      ProductSpecificationUtil.validateMany(
        specificationSchema,
        specification,
        true,
        true,
        true,
      );

      const { id: itemId } = await this.itemsRepo.createOne(
        title,
        description,
        specification,
        categoryId,
        inStockNumber,
        manager,
      );

      await this.pricesRepo.createOne(itemId, priceValue, manager);
      await this.imagesRepo.createMany(itemId, images, manager);

      const product = await this.itemsRepo.findOne(itemId, true, manager);

      return product;
    });

    return result;
  }

  async updateOne(
    itemId: number,
    title?: string,
    description?: string,
    specification?: IProductSpecification,
    categoryId?: number,
    images?: ICreateProductImage[],
    priceValue?: number,
    inStockNumber?: number,
  ): Promise<IProductItem> {
    const result = await this.dataSource.transaction(async (manager) => {
      const currentProductItem = await this.itemsRepo.findOne(
        itemId,
        true,
        manager,
      );

      const { price, productCategoryId: currentProductCategoryId } =
        currentProductItem;

      const currentProductImages = DbUtil.getRelatedEntityOrThrow<
        IProductItem,
        IProductImage[]
      >(currentProductItem, 'productImages');

      if (specification) {
        const { specificationSchema } = await this.categoriesService.findOne(
          categoryId || currentProductCategoryId,
          true,
          manager,
        );

        ProductSpecificationUtil.validateMany(
          specificationSchema,
          specification,
          true,
          true,
          true,
        );
      }

      let actualSpecification = specification;

      if (
        categoryId &&
        currentProductCategoryId !== categoryId &&
        !specification
      ) {
        actualSpecification = {};
      }

      if (priceValue !== undefined && priceValue !== price) {
        await this.pricesRepo.createOne(itemId, priceValue, manager);
      }

      if (images !== undefined) {
        await this.imagesRepo.destroyMany(
          currentProductImages.map((image) => image.id),
          manager,
        );
        await this.imagesRepo.createMany(itemId, images, manager);
      }

      const product = await this.itemsRepo.updateOne(
        itemId,
        title,
        description,
        actualSpecification,
        categoryId,
        inStockNumber,
        manager,
      );

      return product;
    });

    return result;
  }
}
