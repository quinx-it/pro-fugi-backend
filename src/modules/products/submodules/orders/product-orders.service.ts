import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { productsConfig } from '@/configs/products.config';
import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import {
  IAuthCustomerRole,
  IAuthCustomerRoleAddress,
} from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { ProductOrderAddressesRepository } from '@/modules/products/submodules/orders/repositories/product-order-addresses.repository';
import { ProductOrderItemsRepository } from '@/modules/products/submodules/orders/repositories/product-order-items.repository';
import { ProductOrdersRepository } from '@/modules/products/submodules/orders/repositories/product-orders.repository';
import {
  ICreateProductOrderItem,
  ICreateProductOrderItemAsAdmin,
  IProductCustomerDiscount,
  IProductDiscountPolicy,
  IProductOrder,
  IProductOrderAddress,
  IProductOrderItem,
  IProductOrdersSearchView,
} from '@/modules/products/submodules/orders/types';
import { ProductDiscountsUtil } from '@/modules/products/submodules/orders/utils/product-discounts.util';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IAddress,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';
import { PromisesUtil } from '@/shared/utils/promises.util';

@Injectable()
export class ProductOrdersService {
  private readonly discountPolicy: IProductDiscountPolicy;

  private readonly freeShippingThreshold: number;

  private readonly shippingPrice: number;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly ordersRepo: ProductOrdersRepository,
    private readonly orderItemsRepo: ProductOrderItemsRepository,
    private readonly orderAddressesRepo: ProductOrderAddressesRepository,
    private readonly customerRolesService: AuthCustomerRolesService,
    @Inject(forwardRef(() => ProductItemsService))
    private readonly productItemsService: ProductItemsService,
    private readonly authUsersService: AuthUsersService,
  ) {
    const { discountPolicy, freeShippingThreshold, shippingPrice } =
      productsConfig;

    this.discountPolicy = discountPolicy;
    this.freeShippingThreshold = freeShippingThreshold;
    this.shippingPrice = shippingPrice;
  }

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
    manager?: EntityManager,
  ): Promise<IProductOrder>;

  async findOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IProductOrder | null>;

  async findOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductOrder | null> {
    const productOrder = throwIfNotFound
      ? await this.ordersRepo.findOne(productOrderId, true, manager)
      : await this.ordersRepo.findOne(productOrderId, false, manager);

    if (productOrder?.authCustomerRoleId !== customerRoleId) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          { value: 'Product order' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return productOrder;
  }

  async createOne(
    customerRoleId: number | null,
    productOrderItems:
      | ICreateProductOrderItem[]
      | ICreateProductOrderItemAsAdmin[],
    deliveryType: ProductOrderDeliveryType,
    nonDefaultAddress: IAddress | null,
    nonDefaultPhone: string | null,
    comment: string | null,
    manager: EntityManager | null = null,
  ): Promise<IProductOrder> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const productOrderItemsExtended = await PromisesUtil.runSequentially(
          productOrderItems,
          async (productOrderItem) => {
            const {
              productItem: { id: productItemId },
              count,
            } = productOrderItem;

            const customPricePerProductItem =
              'customPricePerProductItem' in productOrderItem &&
              typeof productOrderItem.customPricePerProductItem === 'number'
                ? productOrderItem.customPricePerProductItem
                : null;

            const productItem = await this.productItemsService.findOne(
              productItemId,
              true,
              transactionManager,
            );

            const { isArchived, inStockNumber, name } = productItem;

            if (isArchived) {
              throw AppException.fromTemplate(
                ERROR_MESSAGES.PRODUCT_ITEM_IS_ARCHIVED,
                { id: productItemId.toString(), name },
                HttpStatus.BAD_REQUEST,
              );
            }

            if (count > inStockNumber) {
              throw AppException.fromTemplate(
                ERROR_MESSAGES.PRODUCT_ITEM_NOT_ENOUGH_IN_STOCK,
                { id: productItemId.toString(), name },
                HttpStatus.BAD_REQUEST,
              );
            }

            return {
              productItem,
              count,
              customPricePerProductItem,
            };
          },
        );

        let defaultAddress: IAddress | null = null;
        let defaultPhone: string | null = null;

        if (customerRoleId) {
          const authCustomerRole = await this.customerRolesService.findOne(
            customerRoleId,
            true,
            transactionManager,
          );

          const { authUserId } = authCustomerRole;

          defaultAddress = DbUtil.getRelatedEntityOrThrow<
            IAuthCustomerRole,
            IAuthCustomerRoleAddress
          >(authCustomerRole, 'address');

          const authUser = await this.authUsersService.findOne(
            authUserId,
            true,
            transactionManager,
          );

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
          throw AppException.fromTemplate(
            ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
            { value: 'Address to order' },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!phone) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
            { value: 'Phone to order' },
            HttpStatus.BAD_REQUEST,
          );
        }

        const { discount } = customerRoleId
          ? await this.findCustomerDiscount(customerRoleId)
          : { discount: null };

        const { id: productOrderId } = await this.ordersRepo.createOne(
          customerRoleId,
          this.shippingPrice,
          this.freeShippingThreshold,
          ProductDiscountsUtil.getFixedValue(discount) || 0,
          ProductDiscountsUtil.getPercentage(discount) || 0,
          0,
          phone,
          comment,
          ProductOrderStatus.PROCESSING,
          deliveryType,
          transactionManager,
        );

        if (address && deliveryType === ProductOrderDeliveryType.SHIPPING) {
          const { city, street, building, block, apartment } = address;

          await this.orderAddressesRepo.createOne(
            productOrderId,
            city,
            street,
            building,
            block,
            apartment,
            transactionManager,
          );
        }

        await PromisesUtil.runSequentially(
          productOrderItemsExtended,
          async ({ productItem, count, customPricePerProductItem }) => {
            const { id: productItemId, price, name } = productItem;

            const orderPrice = customPricePerProductItem || price;

            if (!orderPrice) {
              throw AppException.fromTemplate(
                ERROR_MESSAGES.PRODUCT_ITEM_HAS_NO_RELEVANT_PRICE_TEMPLATE,
                { id: productItemId.toString(), name },
                HttpStatus.BAD_REQUEST,
              );
            }

            await this.orderItemsRepo.createOne(
              productOrderId,
              productItemId,
              count,
              orderPrice,
              transactionManager,
            );
          },
        );

        const productOrder = await this.ordersRepo.findOne(
          productOrderId,
          true,
          transactionManager,
        );

        return productOrder;
      },
      this.dataSource,
      manager,
    );
  }

  async updateOne(
    customerRoleId: number | undefined,
    productOrderId: number,
    deliveryType?: ProductOrderDeliveryType,
    nonDefaultAddress?: IAddress | null,
    nonDefaultPhone?: string | null,
    status?: ProductOrderStatus,
    manualPriceAdjustment?: number,
    manager: EntityManager | null = null,
  ): Promise<IProductOrder> {
    return DbUtil.transaction(
      async (transactionManager) => {
        if (customerRoleId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
            { authRole: AuthRole.ADMIN },
            HttpStatus.FORBIDDEN,
          );
        }

        let defaultAddress: IAddress | null | undefined =
          nonDefaultAddress === undefined ? undefined : null;
        const defaultPhone: string | null | undefined =
          nonDefaultPhone === undefined ? undefined : null;

        const currentProductOrder = await this.ordersRepo.findOne(
          productOrderId,
          true,
          transactionManager,
        );

        const {
          authCustomerRoleId: orderCustomerRoleId,
          deliveryType: orderDeliveryType,
        } = currentProductOrder;

        const currentOrderAddress = DbUtil.getRelatedEntityOrThrow<
          IProductOrder,
          IProductOrderAddress
        >(currentProductOrder, 'address');

        if (orderCustomerRoleId) {
          const customerRole = await this.customerRolesService.findOne(
            orderCustomerRoleId,
            true,
            transactionManager,
          );

          defaultAddress = DbUtil.getRelatedEntityOrThrow<
            IAuthCustomerRole,
            IAuthCustomerRoleAddress
          >(customerRole, 'address');
        }

        let address =
          nonDefaultAddress === undefined
            ? null
            : nonDefaultAddress || defaultAddress;

        if (
          (deliveryType || orderDeliveryType) !==
          ProductOrderDeliveryType.SHIPPING
        ) {
          address = null;
        }

        const phone =
          nonDefaultPhone === undefined
            ? undefined
            : nonDefaultPhone || defaultPhone;

        if (phone === null) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
            { value: 'Phone' },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (address !== undefined) {
          if (currentOrderAddress) {
            await this.orderAddressesRepo.destroyOne(
              currentOrderAddress.id,
              transactionManager,
            );
          }

          if (address !== null) {
            const { city, street, building, block, apartment } = address;

            await this.orderAddressesRepo.createOne(
              productOrderId,
              city,
              street,
              building,
              block,
              apartment,
              transactionManager,
            );
          }
        }

        const productOrder = await this.ordersRepo.updateOne(
          productOrderId,
          undefined,
          this.shippingPrice,
          this.freeShippingThreshold,
          undefined,
          undefined,
          manualPriceAdjustment,
          phone,
          undefined,
          status,
          deliveryType,
          transactionManager,
        );

        return productOrder;
      },
      this.dataSource,
      manager,
    );
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
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          { value: 'Product order item' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    const productOrderItem = throwIfNotFound
      ? await this.orderItemsRepo.findOne(productOrderItemId, true)
      : await this.orderItemsRepo.findOne(productOrderItemId, false);

    if (productOrderItem?.productOrderId !== productOrderId) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          { value: 'Product order item' },
          HttpStatus.BAD_REQUEST,
        );
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
    manager: EntityManager | null = null,
  ): Promise<IProductOrderItem> {
    return DbUtil.transaction(
      async (transactionManager) => {
        if (customerRoleId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
            { authRole: AuthRole.ADMIN },
            HttpStatus.FORBIDDEN,
          );
        }

        const { price, name } = await this.productItemsService.findOne(
          productItemId,
          true,
          transactionManager,
        );

        const orderPrice = customPerItemPrice || price;

        if (orderPrice === null) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_ITEM_HAS_NO_RELEVANT_PRICE_TEMPLATE,
            { id: productItemId.toString(), name },
            HttpStatus.BAD_REQUEST,
          );
        }

        const orderItem = await this.orderItemsRepo.createOne(
          productOrderId,
          productItemId,
          count,
          orderPrice,
          transactionManager,
        );

        return orderItem;
      },
      this.dataSource,
      manager,
    );
  }

  async updateOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    productItemId?: number,
    count?: number,
    customPerItemPrice?: number | null,
    manager: EntityManager | null = null,
  ): Promise<IProductOrderItem> {
    return DbUtil.transaction(
      async (transactionManager) => {
        if (customerRoleId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
            { authRole: AuthRole.ADMIN },
            HttpStatus.FORBIDDEN,
          );
        }

        const {
          productOrderId: actualOrderId,
          productItemId: currentProductItemId,
          pricePerProductItem,
        } = await this.orderItemsRepo.findOne(
          productOrderItemId,
          true,
          transactionManager,
        );

        if (productOrderId !== actualOrderId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
            {
              value: 'Product order',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const newProductItemId = productItemId || currentProductItemId;

        const { price, name } = await this.productItemsService.findOne(
          newProductItemId,
          true,
          transactionManager,
        );

        let perItemPrice: number | null;

        if (customPerItemPrice === null) {
          perItemPrice = price;
        } else {
          perItemPrice =
            customPerItemPrice === undefined
              ? pricePerProductItem
              : customPerItemPrice;
        }

        if (perItemPrice === null) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.PRODUCT_ITEM_HAS_NO_RELEVANT_PRICE_TEMPLATE,
            { id: newProductItemId.toString(), name },
            HttpStatus.BAD_REQUEST,
          );
        }

        const orderItem = await this.orderItemsRepo.updateOne(
          productOrderItemId,
          undefined,
          productItemId,
          count,
          perItemPrice,
          transactionManager,
        );

        return orderItem;
      },
      this.dataSource,
      manager,
    );
  }

  async destroyOnesItem(
    customerRoleId: number | undefined,
    productOrderId: number,
    productOrderItemId: number,
    manager: EntityManager | null = null,
  ): Promise<void> {
    await DbUtil.transaction(
      async (transactionManager) => {
        if (customerRoleId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
            { authRole: AuthRole.ADMIN },
            HttpStatus.FORBIDDEN,
          );
        }

        const { productOrderId: actualOrderId } =
          await this.orderItemsRepo.findOne(
            productOrderItemId,
            true,
            transactionManager,
          );

        if (productOrderId !== actualOrderId) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
            {
              value: 'Product order',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.orderItemsRepo.destroyMany(
          [productOrderItemId],
          transactionManager,
        );
      },
      this.dataSource,
      manager,
    );
  }

  async findCustomerDiscount(
    authCustomerRoleId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IProductCustomerDiscount> {
    const totalSum = await this.findCustomerOrdersTotalSum(
      authCustomerRoleId,
      true,
      manager,
    );

    const discount = ProductDiscountsUtil.getOne(this.discountPolicy, totalSum);

    return discount;
  }

  async findCustomerOrdersTotalSum(
    authCustomerRoleId: number,
    completedOnly: boolean = true,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const orders = await this.ordersRepo.findMany(
      authCustomerRoleId,
      completedOnly ? ProductOrderStatus.COMPLETED : undefined,
      manager,
    );

    const totalSum = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    return totalSum;
  }

  async countByProductItem(
    productItem: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<number> {
    const count = await this.ordersRepo.countByProductItem(
      productItem,
      manager,
    );

    return count;
  }

  // endregion
}
