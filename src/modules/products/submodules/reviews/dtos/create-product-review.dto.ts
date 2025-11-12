import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { CreateProductReviewImageDto } from '@/modules/products/submodules/reviews/dtos/create-product-review-image.dto';
import { ICreateProductReview } from '@/modules/products/submodules/reviews/types';

export class CreateProductReviewDto implements ICreateProductReview {
  @ApiProperty()
  @ValidateIf((obj) => obj.text !== null)
  @IsString()
  text!: string | null;

  @ApiProperty()
  @IsInt()
  rating!: number;

  @ApiProperty()
  @IsArray()
  @Type(() => CreateProductReviewImageDto)
  @ValidateNested({})
  productReviewImages!: CreateProductReviewImageDto[];
}
