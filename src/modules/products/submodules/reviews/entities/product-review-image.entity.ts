import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductReviewEntity } from '@/modules/products/submodules/reviews/entities/product-review.entity';
import { IProductReviewImage } from '@/modules/products/submodules/reviews/types';
import { DbType, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductReviewImageEntity implements IProductReviewImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  fileName!: string;

  @ManyToOne(
    () => ProductReviewEntity,
    (review) => review.productReviewImages,
    {
      onUpdate: RefIntegrityRule.CASCADE,
      onDelete: RefIntegrityRule.CASCADE,
    },
  )
  @JoinColumn()
  productReview?: ProductReviewEntity;

  @Column(DbType.INTEGER)
  productReviewId!: number;
}
