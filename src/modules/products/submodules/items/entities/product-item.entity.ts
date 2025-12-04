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

import { ProductCategoryEntity } from '@/modules/products/submodules/categories/entities/product-category.entity';
import { ProductGroupEntity } from '@/modules/products/submodules/groups/entities/product-group.entity';
import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import {
  IProductItem,
  IProductSpecification,
} from '@/modules/products/submodules/items/types';
import { ProductOrderItemEntity } from '@/modules/products/submodules/orders/entities/product-order-item.entity';
import { ProductReviewEntity } from '@/modules/products/submodules/reviews/entities/product-review.entity';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { DbType, DbUtil, RefIntegrityRule } from '@/shared';

@Entity()
export class ProductItemEntity implements IProductItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  name!: string;

  @Column(DbType.VARCHAR)
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProductReviewEntity, (review) => review.productItem)
  productReviews?: ProductReviewEntity[];

  @Column(DbType.INTEGER)
  inStockNumber!: number;

  @ManyToOne(() => ProductCategoryEntity, (category) => category.productItems, {
    onDelete: RefIntegrityRule.CASCADE,
    onUpdate: RefIntegrityRule.CASCADE,
  })
  @JoinColumn()
  productCategory?: ProductCategoryEntity;

  @Column(DbType.INTEGER)
  productCategoryId!: number;

  @ManyToOne(() => ProductGroupEntity, (category) => category.productItems, {
    nullable: true,
    onDelete: RefIntegrityRule.SET_NULL,
    onUpdate: RefIntegrityRule.SET_NULL,
  })
  @JoinColumn()
  productGroup?: ProductGroupEntity | null;

  @Column(DbType.INTEGER, { nullable: true })
  productGroupId!: number | null;

  @Column(DbType.JSONB, { default: JSON.stringify({}) })
  specification: IProductSpecification = {};

  @OneToMany(() => ProductImageEntity, (image) => image.productItem)
  productImages?: ProductImageEntity[];

  @OneToMany(() => ProductOrderItemEntity, (orderItem) => orderItem.productItem)
  productOrders?: ProductOrderItemEntity[];

  @Column(DbType.BOOLEAN, { default: false })
  isArchived: boolean = false;

  @Column(DbType.FLOAT)
  basePrice!: number;

  @Column(DbType.FLOAT, { nullable: true })
  discountValue!: number | null;

  @Column(DbType.FLOAT, { nullable: true })
  discountPercentage!: number | null;

  get price(): number | null {
    const { basePrice, discountPercentage, discountValue } = this;

    return basePrice * (1 - (discountPercentage || 0)) - (discountValue || 0);
  }

  get rating(): number | null {
    const productReviews = DbUtil.getRelatedEntityOrThrow<
      IProductItem,
      IProductReview[]
    >(this, 'productReviews');

    const { length: ratingsLength } = productReviews;

    if (!ratingsLength) {
      return null;
    }

    const ratingsSum = productReviews
      .map((review) => review.rating)
      .reduce((acc, curr) => acc + curr, 0);

    const averageRating = ratingsSum / ratingsLength;

    return averageRating;
  }
}
