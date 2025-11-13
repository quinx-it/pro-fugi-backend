import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

import { IProductReviewImage } from '@/modules/products/submodules/reviews/types';

export class ProductReviewImageDto implements IProductReviewImage {
  @Exclude()
  id!: number;

  @Exclude()
  productReviewId!: number;

  @ApiProperty()
  @IsString()
  fileName!: string;
}
