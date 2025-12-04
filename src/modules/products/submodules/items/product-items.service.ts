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
import { ProductOrdersService } from '@/modules/products/submodules/orders/product-orders.service';
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
    @Inject(forwardRef(() => ProductCategoriesService))
    private readonly categoriesService: ProductCategoriesService,
    @Inject(forwardRef(() => ProductGroupsService))
    private readonly groupsService: ProductGroupsService,
    @Inject(forwardRef(() => ProductOrdersService))
    private readonly ordersService: ProductOrdersService,
  ) {}

  async findManyPaginated(
    filter: IFilter<IProductItemSearchView>,
    specsFilter: IProductSpecification,
    sort: ISort<IProductItemSearchView>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPaginated<IProductItem>> {
    const { items, totalCount } = await this.itemsRepo.findManyAndCount(
      filter,
      specsFilter,
      sort,
      pagination,
      manager,
    );

    return PaginationUtil.fromSinglePage(items, totalCount, pagination);
  }

  async findMany(
    ids: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductItem[]> {
    const productItems = await this.itemsRepo.findMany(ids, manager);

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

  async countByProductCategory(
    productCategoryId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = await this.itemsRepo.countByProductCategory(
      productCategoryId,
      manager,
    );

    return count;
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
    manager: EntityManager | null = null,
  ): Promise<IProductItem> {
    return DbUtil.transaction(
      async (transactionManager) => {
        if (productGroupId) {
          await this.groupsService.findOne(
            productGroupId,
            true,
            transactionManager,
          );
        }

        const { specificationSchema } = await this.categoriesService.findOne(
          productCategoryId,
          true,
          transactionManager,
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
            await this.groupsService.findOne(
              productGroupId,
              true,
              transactionManager,
            );

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
          transactionManager,
        );

        await this.imagesRepo.createMany(itemId, images, transactionManager);

        const product = await this.itemsRepo.findOne(
          itemId,
          true,
          transactionManager,
        );

        return product;
      },
      this.dataSource,
      manager,
    );
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
    manager: EntityManager | null = null,
  ): Promise<IProductItem> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const currentProductItem = await this.itemsRepo.findOne(
          itemId,
          true,
          transactionManager,
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
            transactionManager,
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
            transactionManager,
          );
          await this.imagesRepo.createMany(itemId, images, transactionManager);
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
              await this.groupsService.findOne(
                productGroupId,
                true,
                transactionManager,
              );

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
          transactionManager,
        );

        return product;
      },
      this.dataSource,
      manager,
    );
  }

  async destroyOne(
    productItemId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await DbUtil.transaction(
      async (transactionManager) => {
        const productOrdersCount = await this.ordersService.countByProductItem(
          productItemId,
          transactionManager,
        );

        if (productOrdersCount) {
          const { name } = await this.itemsRepo.findOne(
            productItemId,
            true,
            transactionManager,
          );

          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_ITEM_HAS_RELATED_ORDERS_TEMPLATE,
            {
              productItemName: name,
              productItemId: productItemId.toString(),
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.itemsRepo.destroyOne(productItemId, transactionManager);
      },
      this.dataSource,
      manager,
    );
  }
}
