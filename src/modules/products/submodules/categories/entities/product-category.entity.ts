import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';
import { DbType } from '@/shared';

@Entity()
export class ProductCategoryEntity implements IProductCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  name!: string;

  @Column(DbType.BOOLEAN, { default: false })
  isArchived: boolean = false;

  @Column(DbType.JSONB, { default: JSON.stringify([]) })
  specificationSchema: IProductSpecificationSchemaAttribute[] = [];

  @OneToMany(() => ProductItemEntity, (items) => items.productCategory)
  productItems?: ProductItemEntity[];
}
