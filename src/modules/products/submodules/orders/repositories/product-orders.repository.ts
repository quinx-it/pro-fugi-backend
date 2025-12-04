import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In } from 'typeorm';

import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import {
  ProductOrderEntity,
  ProductOrdersSearchViewEntity,
} from '@/modules/products/submodules/orders/entities';
import {
  IProductOrder,
  IProductOrdersSearchView,
} from '@/modules/products/submodules/orders/types';
import { ProductOrdersUtil } from '@/modules/products/submodules/orders/utils/product-orders.util';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IFilter,
  IPagination,
  ISort,
} from '@/shared';

@Injectable()
export class ProductOrdersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findManyAndCount(
    filter: IFilter<IProductOrdersSearchView>,
    sort: ISort<IProductOrdersSearchView>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<{ items: IProductOrder[]; totalCount: number }> {
    const where = DbUtil.filterToFindOptionsWhere(filter);
    const order = DbUtil.sortToFindOptionsOrder(sort);
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const [searchViewEntities, totalCount] = await manager.findAndCount(
      ProductOrdersSearchViewEntity,
      {
        where,
        order,
        take,
        skip,
      },
    );

    const ids = searchViewEntities.map(
      (searchViewEntity) => searchViewEntity.id,
    );

    const productOrders = await manager.find(ProductOrderEntity, {
      where: { id: In(ids) },
      relations: [
        'authCustomerRole',
        'productOrderItems',
        'productOrderItems.productItem',
        'address',
      ],
    });

    const productMap = new Map(productOrders.map((p) => [p.id, p]));

    const items = ids
      .map((id) => productMap.get(id))
      .filter((product): product is ProductOrderEntity => product !== undefined)
      .map((productOrder) => ProductOrdersUtil.toPlain(productOrder));

    return { items, totalCount };
  }

  async findMany(
    authCustomerRoleId: number,
    status: ProductOrderStatus | undefined,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder[]> {
    const productOrders = await manager.find(ProductOrderEntity, {
      where: { authCustomerRoleId, status },
      relations: [
        'authCustomerRole',
        'productOrderItems',
        'productOrderItems.productItem',
        'address',
      ],
    });

    return productOrders.map((productOrder) =>
      ProductOrdersUtil.toPlain(productOrder),
    );
  }

  async countByProductItem(
    productItemId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = await manager.count(ProductOrderEntity, {
      where: { productOrderItems: { productItemId } },
    });

    return count;
  }

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IProductOrder>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductOrder | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder | null> {
    const productOrder = await manager.findOne(ProductOrderEntity, {
      where: { id },
      relations: [
        'authCustomerRole',
        'productOrderItems',
        'productOrderItems.productItem',
        'address',
      ],
    });

    if (!productOrder) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Product order',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return ProductOrdersUtil.toPlain(productOrder);
  }

  async createOne(
    authCustomerRoleId: number | null,
    configShippingPrice: number,
    configFreeShippingThreshold: number,
    discountValue: number,
    discountPercentage: number,
    manualPriceAdjustment: number,
    phone: string,
    comment: string | null,
    status: ProductOrderStatus,
    deliveryType: ProductOrderDeliveryType,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder> {
    const { id } = await manager.save(ProductOrderEntity, {
      authCustomerRoleId,
      phone,
      comment,
      configShippingPrice,
      configFreeShippingThreshold,
      discountValue,
      discountPercentage,
      manualPriceAdjustment,
      status,
      deliveryType,
    });

    const productOrder = await this.findOne(id, true, manager);

    return ProductOrdersUtil.toPlain(productOrder);
  }

  async updateOne(
    id: number,
    authCustomerRoleId?: number | null,
    configShippingPrice?: number,
    configFreeShippingThreshold?: number,
    discountValue?: number,
    discountPercentage?: number,
    manualPriceAdjustment?: number,
    phone?: string,
    comment?: string | null,
    status?: ProductOrderStatus,
    deliveryType?: ProductOrderDeliveryType,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder> {
    if (
      authCustomerRoleId !== undefined ||
      manualPriceAdjustment !== undefined ||
      phone !== undefined ||
      comment !== undefined ||
      status !== undefined ||
      deliveryType !== undefined ||
      configShippingPrice !== undefined ||
      configFreeShippingThreshold !== undefined ||
      discountValue !== undefined ||
      discountPercentage !== undefined
    ) {
      await manager.update(ProductOrderEntity, id, {
        authCustomerRoleId,
        phone,
        comment,
        configShippingPrice,
        configFreeShippingThreshold,
        discountValue,
        discountPercentage,
        manualPriceAdjustment,
        status,
        deliveryType,
      });
    }

    const productOrder = await this.findOne(id, true, manager);

    return ProductOrdersUtil.toPlain(productOrder);
  }

  async destroyMany(
    ids: number[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    if (!ids.length) {
      return 0;
    }

    const { affected } = await manager.delete(ProductOrderEntity, ids);

    return affected || 0;
  }
}
