import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ICreateProductReviewImage } from '@/modules/products/submodules/reviews/types';

export class CreateProductReviewImageDto implements ICreateProductReviewImage {
  @ApiProperty()
  @IsString()
  fileName!: string;
}
