import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { ProductItemEntity } from '@/modules/products/submodules/items/entities/product-item.entity';
import { ProductReviewImageEntity } from '@/modules/products/submodules/reviews/entities/product-review-image.entity';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { DbType, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductReviewEntity implements IProductReview {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.INTEGER)
  rating!: number;

  @Column(DbType.VARCHAR, { nullable: true })
  text!: string | null;

  @ManyToOne(() => ProductItemEntity, {
    onDelete: RefIntegrityRule.CASCADE,
    onUpdate: RefIntegrityRule.CASCADE,
  })
  @JoinColumn()
  productItem?: ProductItemEntity;

  @Column(DbType.INTEGER)
  productItemId!: number;

  @ManyToOne(() => AuthCustomerRoleEntity, {
    onDelete: RefIntegrityRule.CASCADE,
    onUpdate: RefIntegrityRule.CASCADE,
  })
  @JoinColumn()
  authCustomerRole?: AuthCustomerRoleEntity;

  @Column(DbType.INTEGER)
  authCustomerRoleId!: number;

  @OneToMany(() => ProductReviewImageEntity, (image) => image.productReview)
  productReviewImages?: ProductReviewImageEntity[];
}
