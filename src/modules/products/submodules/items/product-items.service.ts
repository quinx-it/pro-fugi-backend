import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { ProductCategoriesService } from '@/modules/products/submodules/categories/product-categories.service';
import { ProductGroupsService } from '@/modules/products/submodules/groups/product-groups.service';
import { ProductImagesRepository } from '@/modules/products/submodules/items/repositories';
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
  AppException,
  DbUtil,
  ERROR_MESSAGES,
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
    private readonly imagesRepo: ProductImagesRepository,
    private readonly categoriesService: ProductCategoriesService,
    @Inject(forwardRef(() => ProductGroupsService))
    private readonly groupsService: ProductGroupsService,
  ) {}

  async findManyPaginated(
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

  async findMany(ids: number[]): Promise<IProductItem[]> {
    const productItems = await this.itemsRepo.findMany(ids);

    return productItems;
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
    productCategoryId: number,
    productGroupId: number | null,
    images: ICreateProductImage[],
    basePrice: number,
    discountValue: number | null,
    discountPercentage: number | null,
    inStockNumber: number,
  ): Promise<IProductItem> {
    const result = await this.dataSource.transaction(async (manager) => {
      if (productGroupId) {
        await this.groupsService.findOne(productGroupId, true);
      }

      const { specificationSchema } = await this.categoriesService.findOne(
        productCategoryId,
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

      if (productGroupId) {
        const { productCategoryId: productGroupCategoryId } =
          await this.groupsService.findOne(productGroupId, true, manager);

        if (productGroupCategoryId !== productCategoryId) {
          throw new AppException(
            ERROR_MESSAGES.PRODUCT_GROUP_CATEGORY_MISMATCH,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const { id: itemId } = await this.itemsRepo.createOne(
        title,
        description,
        specification,
        productCategoryId,
        productGroupId,
        inStockNumber,
        basePrice,
        discountValue,
        discountPercentage,
        manager,
      );

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
    productCategoryId?: number,
    productGroupId?: number | null,
    images?: ICreateProductImage[],
    basePrice?: number,
    discountValue?: number | null,
    discountPercentage?: number | null,
    inStockNumber?: number,
  ): Promise<IProductItem> {
    const result = await this.dataSource.transaction(async (manager) => {
      const currentProductItem = await this.itemsRepo.findOne(
        itemId,
        true,
        manager,
      );

      const { productCategoryId: currentProductCategoryId } =
        currentProductItem;

      const currentProductImages = DbUtil.getRelatedEntityOrThrow<
        IProductItem,
        IProductImage[]
      >(currentProductItem, 'productImages');

      if (specification) {
        const { specificationSchema } = await this.categoriesService.findOne(
          productCategoryId || currentProductCategoryId,
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
        productCategoryId &&
        currentProductCategoryId !== productCategoryId &&
        !specification
      ) {
        actualSpecification = {};
      }

      if (images !== undefined) {
        await this.imagesRepo.destroyMany(
          currentProductImages.map((image) => image.id),
          manager,
        );
        await this.imagesRepo.createMany(itemId, images, manager);
      }

      let productGroupIdModified: undefined | null | number = productGroupId;

      if (
        productCategoryId !== undefined &&
        productCategoryId !== currentProductCategoryId
      ) {
        if (!productGroupId) {
          productGroupIdModified = null;
        } else {
          const { productCategoryId: productGroupCategoryId } =
            await this.groupsService.findOne(productGroupId, true, manager);

          if (productGroupCategoryId !== productCategoryId) {
            productGroupIdModified = null;
          }
        }
      }

      const product = await this.itemsRepo.updateOne(
        itemId,
        title,
        description,
        actualSpecification,
        productCategoryId,
        productGroupIdModified,
        inStockNumber,
        basePrice,
        discountValue,
        discountPercentage,
        manager,
      );

      return product;
    });

    return result;
  }

  async destroyOne(
    productItemId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    try {
      await this.itemsRepo.destroyOne(productItemId, manager);
    } catch (error) {
      if (DbUtil.isNoActionRelated(error)) {
        const { name: productItemName } = await this.itemsRepo.findOne(
          productItemId,
          true,
        );

        throw AppException.fromTemplate(
          ERROR_MESSAGES.PRODUCT_ITEM_HAS_RELATED_ORDERS_TEMPLATE,
          {
            productItemName,
            productItemId: productItemId.toString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }
}
