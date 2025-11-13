import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductItemEntity } from '@/modules/products/submodules/items/entities';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { ProductOrderEntity } from '@/modules/products/submodules/orders/entities/product-order.entity';
import {
  IProductOrder,
  IProductOrderItem,
} from '@/modules/products/submodules/orders/types';
import { DbType } from '@/shared';

@Entity()
export class ProductOrderItemEntity implements IProductOrderItem {
  @Column(DbType.INTEGER)
  count!: number;

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductItemEntity, (item) => item.productOrders)
  @JoinColumn()
  productItem?: ProductItemEntity;

  @Column(DbType.INTEGER)
  productItemId!: number;

  @ManyToOne(() => ProductOrderEntity, (item) => item.productOrderItems)
  @JoinColumn()
  productOrder?: IProductOrder;

  @Column(DbType.INTEGER)
  productOrderId!: number;

  @Column(DbType.INTEGER)
  pricePerProductItem!: number;

  get totalPrice(): number {
    const { pricePerProductItem, count } = this;

    return pricePerProductItem * count;
  }
}
