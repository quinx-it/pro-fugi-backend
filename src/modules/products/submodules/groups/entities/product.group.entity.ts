import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductCategoryEntity } from '@/modules/products/submodules/categories/entities/product-category.entity';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { ProductItemEntity } from '@/modules/products/submodules/items/entities';
import { DbType } from '@/shared';

@Entity()
export class ProductGroupEntity implements IProductGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  name!: string;

  @Column(DbType.VARCHAR)
  description!: string;

  @Column(DbType.VARCHAR, { nullable: true })
  imageFileName!: string | null;

  @ManyToOne(() => ProductCategoryEntity)
  productCategory!: ProductCategoryEntity;

  @Column(DbType.INTEGER)
  productCategoryId!: number;

  @OneToMany(
    () => ProductItemEntity,
    (productItem) => productItem.productCategory,
  )
  productItems?: ProductItemEntity[];
}
