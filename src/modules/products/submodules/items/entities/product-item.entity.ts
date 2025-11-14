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
import { ProductImageEntity } from '@/modules/products/submodules/items/entities/product-image.entity';
import { ProductPriceEntity } from '@/modules/products/submodules/items/entities/product-price.entity';
import {
  IProductItem,
  IProductPrice,
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

  @OneToMany(() => ProductPriceEntity, (price) => price.productItem)
  productPrices?: ProductPriceEntity[];

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

  @Column(DbType.JSONB, { default: JSON.stringify({}) })
  specification: IProductSpecification = {};

  @OneToMany(() => ProductImageEntity, (image) => image.productItem)
  productImages?: ProductImageEntity[];

  @OneToMany(() => ProductOrderItemEntity, (orderItem) => orderItem.productItem)
  productOrders?: ProductOrderItemEntity[];

  @Column(DbType.BOOLEAN, { default: false })
  isArchived: boolean = false;

  get price(): number | null {
    const productPrices = DbUtil.getRelatedEntityOrThrow<
      IProductItem,
      IProductPrice[]
    >(this, 'productPrices');

    if (!productPrices.length) {
      return null;
    }

    const latestPrice = productPrices.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );

    if (!latestPrice) {
      return null;
    }

    return latestPrice.value;
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
