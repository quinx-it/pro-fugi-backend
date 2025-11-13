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
      ],
    });

    const productMap = new Map(productOrders.map((p) => [p.id, p]));

    const items = ids
      .map((id) => productMap.get(id))
      .filter((product): product is ProductOrderEntity => product !== undefined)
      .map((productOrder) => ProductOrdersUtil.toPlain(productOrder));

    return { items, totalCount };
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
    customerRoleId: number | null,
    shippingPriceRate: number,
    freeShippingThreshold: number,
    correctionPrice: number,
    address: string | null,
    phone: string,
    comment: string | null,
    status: ProductOrderStatus,
    deliveryType: ProductOrderDeliveryType,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder> {
    const { id } = await manager.save(ProductOrderEntity, {
      authCustomerRoleId: customerRoleId,
      address,
      phone,
      comment,
      configShippingPrice: shippingPriceRate,
      configFreeShippingThreshold: freeShippingThreshold,
      manualPriceAdjustment: correctionPrice,
      status,
      deliveryType,
    });

    const productOrder = await this.findOne(id, true, manager);

    return ProductOrdersUtil.toPlain(productOrder);
  }

  async updateOne(
    id: number,
    customerRoleId?: number | null,
    shippingPriceRate?: number,
    freeShippingThreshold?: number,
    correctionPrice?: number,
    address?: string | null,
    phone?: string,
    comment?: string | null,
    status?: ProductOrderStatus,
    deliveryType?: ProductOrderDeliveryType,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder> {
    if (
      customerRoleId !== undefined ||
      correctionPrice !== undefined ||
      address !== undefined ||
      phone !== undefined ||
      comment !== undefined ||
      status !== undefined ||
      deliveryType !== undefined ||
      shippingPriceRate !== undefined ||
      freeShippingThreshold !== undefined
    ) {
      await manager.update(ProductOrderEntity, id, {
        authCustomerRoleId: customerRoleId,
        address,
        phone,
        comment,
        manualPriceAdjustment: correctionPrice,
        status,
        deliveryType,
        configShippingPrice: shippingPriceRate,
        configFreeShippingThreshold: freeShippingThreshold,
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
