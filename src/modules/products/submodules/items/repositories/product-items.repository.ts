import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, In } from 'typeorm';

import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import {
  IProductItem,
  IProductItemSearchView,
  IProductSpecificationAttribute,
} from '@/modules/products/submodules/items/types';
import { ProductItemsUtil } from '@/modules/products/submodules/items/utils/product-items.util';
import { ProductItemSearchViewEntity } from '@/modules/products/submodules/reviews/entities';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IFilter,
  IPagination,
  ISort,
} from '@/shared';
import { JsonBinaryUtil } from '@/shared/utils/json-binary.util';

@Injectable()
export class ProductItemsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findManyAndCount(
    filter: IFilter<IProductItemSearchView>,
    specificationFilter: IProductSpecificationAttribute[],
    sort: ISort<IProductItemSearchView>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<{ items: IProductItem[]; totalCount: number }> {
    const where = DbUtil.filterToFindOptionsWhere(filter);
    const order = DbUtil.sortToFindOptionsOrder(sort);
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const specification =
      JSON.stringify(specificationFilter) === JSON.stringify([])
        ? undefined
        : (JsonBinaryUtil.parseJsonbQuery(
            specificationFilter as unknown as Record<string, number | string>[],
            { columnAlias: 'specification' },
          ) as FindOptionsWhere<ProductItemEntity>);

    const [productViews, totalCount] = await manager.findAndCount(
      ProductItemSearchViewEntity,
      {
        where: {
          ...where,
          specification,
        },
        order,
        take,
        skip,
      },
    );

    const ids = productViews.map(({ id }) => id);

    const products = await manager.find(ProductItemEntity, {
      where: { id: In(ids) },
      relations: [
        'productPrices',
        'productReviews',
        'productCategory',
        'productImages',
      ],
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = ids
      .map((id) => productMap.get(id))
      .filter((product): product is ProductItemEntity => product !== undefined)
      .map((item) => ProductItemsUtil.toPlain(item));

    return { items, totalCount };
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
    const product = await manager.findOne(ProductItemEntity, {
      where: { id },
      relations: [
        'productPrices',
        'productReviews',
        'productCategory',
        'productImages',
      ],
    });

    if (!product && throwIfNotFound) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
        { value: 'Product' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return product ? ProductItemsUtil.toPlain(product) : null;
  }

  async createOne(
    title: string,
    description: string,
    specification: IProductSpecificationAttribute[],
    categoryId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductItem> {
    const { id } = await manager.save(
      ProductItemEntity,
      manager.create(ProductItemEntity, {
        name: title,
        description,
        specification,
        productCategoryId: categoryId,
      }),
    );

    const product = await this.findOne(id, true, manager);

    return ProductItemsUtil.toPlain(product);
  }

  async updateOne(
    id: number,
    title?: string,
    description?: string,
    specification?: IProductSpecificationAttribute[],
    categoryId?: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductItem> {
    if (
      title !== undefined ||
      description !== undefined ||
      specification !== undefined
    ) {
      await manager.update(ProductItemEntity, id, {
        name: title,
        description,
        specification,
        productCategoryId: categoryId,
      });
    }

    const product = await this.findOne(id, true, manager);

    return ProductItemsUtil.toPlain(product);
  }
}
