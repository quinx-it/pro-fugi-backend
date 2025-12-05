import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PRODUCT_REVIEW_IMAGES_PATH } from '@/modules/products/submodules/reviews/constants';
import { ICreateProductReviewImage } from '@/modules/products/submodules/reviews/types';
import { IsFileLocated } from '@/shared/validators/is-located';

export class CreateProductReviewImageDto implements ICreateProductReviewImage {
  @ApiProperty()
  @IsString()
  @IsFileLocated(PRODUCT_REVIEW_IMAGES_PATH)
  fileName!: string;
}
