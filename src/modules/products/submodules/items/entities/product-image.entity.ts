import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductImageType } from '@/modules/products/submodules/items/constants';
import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import { IProductImage } from '@/modules/products/submodules/items/types';
import { DbType, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductImageEntity implements IProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  fileName!: string;

  @Column(DbType.VARCHAR)
  type!: ProductImageType;

  @ManyToOne(() => ProductItemEntity, (item) => item.productImages, {
    onUpdate: RefIntegrityRule.CASCADE,
    onDelete: RefIntegrityRule.CASCADE,
  })
  @JoinColumn()
  productItem?: ProductItemEntity;

  @Column(DbType.INTEGER)
  productItemId!: number;
}
