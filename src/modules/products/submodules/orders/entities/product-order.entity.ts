import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { ProductOrderItemEntity } from '@/modules/products/submodules/orders/entities/product-order-item.entity';
import {
  IProductOrder,
  IProductOrderItem,
} from '@/modules/products/submodules/orders/types';
import { DbType, DbUtil, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductOrderEntity implements IProductOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => AuthCustomerRoleEntity,
    (customerRole) => customerRole.productOrders,
    { nullable: true },
  )
  @JoinColumn()
  authCustomerRole!: AuthCustomerRoleEntity | null;

  @Column(DbType.INTEGER, { nullable: true })
  authCustomerRoleId!: number | null;

  @OneToMany(
    () => ProductOrderItemEntity,
    (orderItem) => orderItem.productOrder,
    {
      onDelete: RefIntegrityRule.CASCADE,
      onUpdate: RefIntegrityRule.CASCADE,
    },
  )
  productOrderItems?: ProductOrderItemEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column(DbType.VARCHAR)
  deliveryType!: ProductOrderDeliveryType;

  @Column(DbType.VARCHAR)
  status!: ProductOrderStatus;

  @Column(DbType.VARCHAR, { nullable: true })
  comment!: string | null;

  @Column(DbType.FLOAT)
  manualPriceAdjustment!: number;

  @Column(DbType.VARCHAR, { nullable: true })
  address!: string | null;

  @Column(DbType.VARCHAR)
  phone!: string;

  @Column(DbType.FLOAT)
  configShippingPrice!: number;

  @Column(DbType.FLOAT)
  configFreeShippingThreshold!: number;

  @Column(DbType.FLOAT)
  discountValue!: number;

  @Column(DbType.FLOAT)
  discountPercentage!: number;

  get productItemsPrice(): number {
    const productOrderItems = DbUtil.getRelatedEntityOrThrow<
      IProductOrder,
      IProductOrderItem[]
    >(this, 'productOrderItems');

    const itemsPrice = productOrderItems.reduce(
      (acc, curr) => acc + curr.pricePerProductItem * curr.count,
      0,
    );

    return itemsPrice;
  }

  get deliveryPrice(): number {
    const {
      productItemsPrice,
      configShippingPrice,
      configFreeShippingThreshold,
      discountValue,
      discountPercentage,
    } = this;

    const productOrderItems = DbUtil.getRelatedEntityOrThrow<
      IProductOrder,
      IProductOrderItem[]
    >(this, 'productOrderItems');

    return productItemsPrice * (1 - discountPercentage) + discountValue >=
      configFreeShippingThreshold || !productOrderItems.length
      ? 0
      : configShippingPrice;
  }

  get totalPrice(): number {
    const {
      productItemsPrice,
      deliveryPrice,
      manualPriceAdjustment,
      discountValue,
      discountPercentage,
    } = this;

    return (
      productItemsPrice * (1 - discountPercentage) +
      discountValue +
      deliveryPrice +
      manualPriceAdjustment
    );
  }
}
