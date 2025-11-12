import { ClassConstructor } from 'class-transformer';

import { ProductReviewDto } from '@/modules/products/submodules/reviews/dtos/product-review.dto';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PaginatedProductReviewsDto extends PaginatedDto<IProductReview> {
  get dtoItemClass(): ClassConstructor<IProductReview> {
    return ProductReviewDto;
  }
}
