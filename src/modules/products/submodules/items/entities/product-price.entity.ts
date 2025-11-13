import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import { IProductPrice } from '@/modules/products/submodules/items/types';
import { DbType, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductPriceEntity implements IProductPrice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.INTEGER)
  value!: number;

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @Column(DbType.INTEGER)
  productItemId!: number;

  @ManyToOne(() => ProductItemEntity, (product) => product.productPrices, {
    onDelete: RefIntegrityRule.CASCADE,
    onUpdate: RefIntegrityRule.CASCADE,
  })
  @JoinColumn()
  productItem?: ProductItemEntity;
}
