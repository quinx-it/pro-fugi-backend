import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductOrderEntity } from '@/modules/products/submodules/orders/entities/product-order.entity';
import { IProductOrderAddress } from '@/modules/products/submodules/orders/types';
import { DbType } from '@/shared';

@Entity()
export class ProductOrderAddressEntity implements IProductOrderAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  city!: string;

  @Column(DbType.VARCHAR)
  street!: string;

  @Column(DbType.VARCHAR)
  building!: string;

  @Column(DbType.VARCHAR, { nullable: true })
  block!: string | null;

  @Column(DbType.VARCHAR, { nullable: true })
  apartment!: string | null;

  @OneToOne(() => ProductOrderEntity, (productOrder) => productOrder.address)
  @JoinColumn()
  productOrder?: ProductOrderEntity;

  @Column(DbType.INTEGER)
  productOrderId!: number;
}
