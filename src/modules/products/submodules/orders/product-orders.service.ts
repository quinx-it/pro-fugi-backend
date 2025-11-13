import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { productsConfig } from '@/configs/products.config';
import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { ProductOrderItemsRepository } from '@/modules/products/submodules/orders/repositories/product-order-items.repository';
import { ProductOrdersRepository } from '@/modules/products/submodules/orders/repositories/product-orders.repository';
import {
  ICreateProductOrderItem,
  IProductOrder,
  IProductOrderItem,
  IProductOrdersSearchView,
} from '@/modules/products/submodules/orders/types';
import {
  DbUtil,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';
import { PromisesUtil } from '@/shared/utils/promises.util';

@Injectable()
export class ProductOrdersService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly ordersRepo: ProductOrdersRepository,
    private readonly orderItemsRepo: ProductOrderItemsRepository,
    private readonly customerRolesService: AuthCustomerRolesService,
    private readonly productItemsService: ProductItemsService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  // region Orders

  async findMany(
    filter: IFilter<IProductOrdersSearchView>,
    sort: ISort<IProductOrdersSearchView>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPaginated<IProductOrder>> {
    const { items, totalCount } = await this.ordersRepo.findManyAndCount(
      filter,
      sort,
      pagination,
      manager,
    );

    return PaginationUtil.fromSinglePage(items, totalCount, pagination);
  }

  async findOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    throwIfNotFound: true,
  ): Promise<IProductOrder>;

  async findOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    throwIfNotFound: false,
  ): Promise<IProductOrder | null>;

  async findOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    throwIfNotFound: boolean,
  ): Promise<IProductOrder | null> {
    const productOrder = throwIfNotFound
      ? await this.ordersRepo.findOne(productOrderId, true)
      : await this.ordersRepo.findOne(productOrderId, false);

    if (productOrder?.authCustomerRoleId !== customerRoleId) {
      if (throwIfNotFound) {
        throw new Error('Not found');
      }

      return null;
    }

    return productOrder;
  }

  async createOne(
    customerRoleId: number | null,
    productOrderItems: ICreateProductOrderItem[],
    deliveryType: ProductOrderDeliveryType,
    nonDefaultAddress: string | null,
    nonDefaultPhone: string | null,
    comment: string | null,
  ): Promise<IProductOrder> {
    const productOrderItemsExtended = await PromisesUtil.runSequentially(
      productOrderItems,
      async (productOrderItem) => {
        const {
          productItem: { id: productItemId },
          count,
          customPricePerProductItem,
        } = productOrderItem;

        const productItem = await this.productItemsService.findOne(
          productItemId,
          true,
        );

        const { isArchived, inStockNumber } = productItem;

        if (isArchived) {
          throw new Error('Cannot order an archived product item');
        }

        if (count > inStockNumber) {
          throw new Error('Not enough items in stock');
        }

        return {
          productItem,
          count,
          customPricePerProductItem,
        };
      },
    );

    let defaultAddress: string | null = null;
    let defaultPhone: string | null = null;

    if (customerRoleId) {
      const { address: customerRoleAddress, authUserId } =
        await this.customerRolesService.findOne(customerRoleId, true);

      defaultAddress = customerRoleAddress;

      const authUser = await this.authUsersService.findOne(authUserId, true);

      const authPhoneMethods = DbUtil.getRelatedEntityOrThrow<
        IAuthUser,
        IAuthPhoneMethod[]
      >(authUser, 'authPhoneMethods');

      const latestAuthPhoneMethod = authPhoneMethods.reduce(
        (latest, current) =>
          current.createdAt > latest.createdAt ? current : latest,
      );

      defaultPhone = latestAuthPhoneMethod?.phone || null;
    }

    const address = nonDefaultAddress || defaultAddress;
    const phone = nonDefaultPhone || defaultPhone;

    if (!address && deliveryType === ProductOrderDeliveryType.SHIPPING) {
      throw new Error('No address');
    }

    if (!phone) {
      throw new Error('No phone set');
    }

    const { shippingPrice: shippingPriceRate, freeShippingThreshold } =
      productsConfig;

    const result = await this.dataSource.transaction(async (manager) => {
      const { id: productOrderId } = await this.ordersRepo.createOne(
        customerRoleId,
        shippingPriceRate,
        freeShippingThreshold,
        0,
        deliveryType === ProductOrderDeliveryType.SHIPPING ? address : null,
        phone,
        comment,
        ProductOrderStatus.PROCESSING,
        deliveryType,
        manager,
      );

      await PromisesUtil.runSequentially(
        productOrderItemsExtended,
        async ({ productItem, count, customPricePerProductItem }) => {
          const { id: productItemId, price } = productItem;

          const orderPrice = customPricePerProductItem || price;

          if (!orderPrice) {
            throw new Error('No price is set');
          }

          await this.orderItemsRepo.createOne(
            productOrderId,
            productItemId,
            count,
            orderPrice,
            manager,
          );
        },
      );

      const productOrder = await this.ordersRepo.findOne(
        productOrderId,
        true,
        manager,
      );

      return productOrder;
    });

    return result;
  }

  async updateOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    deliveryType?: ProductOrderDeliveryType,
    nonDefaultAddress?: string | null,
    nonDefaultPhone?: string | null,
    status?: ProductOrderStatus,
    correctionPrice?: number,
  ): Promise<IProductOrder> {
    if (customerRoleId) {
      throw new Error('Forbidden');
    }

    let defaultAddress: string | null | undefined =
      nonDefaultAddress === undefined ? undefined : null;
    const defaultPhone: string | null | undefined =
      nonDefaultPhone === undefined ? undefined : null;

    const {
      authCustomerRoleId: orderCustomerRoleId,
      deliveryType: orderDeliveryType,
    } = await this.ordersRepo.findOne(productOrderId, true);

    if (orderCustomerRoleId) {
      const customerRole = await this.customerRolesService.findOne(
        orderCustomerRoleId,
        true,
      );

      defaultAddress = customerRole.address;
    }

    let address =
      nonDefaultAddress === undefined
        ? null
        : nonDefaultAddress || defaultAddress;

    if (
      (deliveryType || orderDeliveryType) !== ProductOrderDeliveryType.SHIPPING
    ) {
      address = null;
    }

    const phone =
      nonDefaultPhone === undefined ? null : nonDefaultPhone || defaultPhone;

    if (phone === null) {
      throw new Error('No phone set');
    }

    const productOrder = await this.ordersRepo.updateOne(
      productOrderId,
      undefined,
      undefined,
      undefined,
      correctionPrice,
      address,
      phone,
      undefined,
      status,
      deliveryType,
    );

    return productOrder;
  }

  // endregion

  // region Order items

  async findOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    throwIfNotFound: true,
  ): Promise<IProductOrderItem>;

  async findOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    throwIfNotFound: false,
  ): Promise<IProductOrderItem | null>;

  async findOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    throwIfNotFound: boolean,
  ): Promise<IProductOrderItem | null> {
    const productOrder = throwIfNotFound
      ? await this.ordersRepo.findOne(productOrderId, true)
      : await this.ordersRepo.findOne(productOrderId, false);

    if (customerRoleId !== productOrder?.authCustomerRoleId) {
      if (throwIfNotFound) {
        throw new Error('Not found');
      }

      return null;
    }

    const productOrderItem = throwIfNotFound
      ? await this.orderItemsRepo.findOne(productOrderItemId, true)
      : await this.orderItemsRepo.findOne(productOrderItemId, false);

    if (productOrderItem?.productOrderId !== productOrderId) {
      if (throwIfNotFound) {
        throw new Error('Not found');
      }

      return null;
    }

    return productOrderItem;
  }

  async createOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productItemId: number,
    count: number,
    customPerItemPrice: number | null,
  ): Promise<IProductOrderItem> {
    if (customerRoleId) {
      throw new Error('Forbidden');
    }

    const { price } = await this.productItemsService.findOne(
      productItemId,
      true,
    );

    const orderPrice = customPerItemPrice || price;

    if (!orderPrice) {
      throw new Error('No order price set');
    }

    const orderItem = await this.orderItemsRepo.createOne(
      productOrderId,
      productItemId,
      count,
      orderPrice,
    );

    return orderItem;
  }

  async updateOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    productItemId?: number,
    count?: number,
    customPerItemPrice?: number | null,
  ): Promise<IProductOrderItem> {
    if (customerRoleId) {
      throw new Error('Forbidden');
    }

    const {
      productOrderId: actualOrderId,
      productItemId: currentProductItemId,
      pricePerProductItem,
    } = await this.orderItemsRepo.findOne(productOrderItemId, true);

    const newProductItemId = productItemId || currentProductItemId;

    const { price } = await this.productItemsService.findOne(
      newProductItemId,
      true,
    );

    let perItemPrice: number | null;

    if (customPerItemPrice === null) {
      perItemPrice =
        customPerItemPrice === undefined ? pricePerProductItem : price;
    } else {
      perItemPrice =
        customPerItemPrice === undefined
          ? pricePerProductItem
          : customPerItemPrice;
    }

    if (perItemPrice === null) {
      throw new Error('No price known');
    }

    if (productOrderId !== actualOrderId) {
      throw new Error('Order id mismatch');
    }

    const orderItem = await this.orderItemsRepo.updateOne(
      productOrderItemId,
      undefined,
      productItemId,
      count,
      perItemPrice,
    );

    return orderItem;
  }

  async destroyOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
  ): Promise<void> {
    if (customerRoleId) {
      throw new Error('Forbidden');
    }

    const { productOrderId: actualOrderId } = await this.orderItemsRepo.findOne(
      productOrderItemId,
      true,
    );

    if (productOrderId !== actualOrderId) {
      throw new Error('Order id mismatch');
    }

    await this.orderItemsRepo.destroyMany([productOrderItemId]);
  }

  // endregion
}
