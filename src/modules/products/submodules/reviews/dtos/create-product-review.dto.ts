import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

import { CreateProductReviewImageDto } from '@/modules/products/submodules/reviews/dtos/create-product-review-image.dto';
import { ICreateProductReview } from '@/modules/products/submodules/reviews/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductReviewDto implements ICreateProductReview {
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  text!: string | null;

  @ApiProperty()
  @IsInt()
  rating!: number;

  @ApiProperty({ type: CreateProductReviewImageDto, isArray: true })
  @IsArray()
  @Type(() => CreateProductReviewImageDto)
  @ValidateNested({ each: true })
  productReviewImages!: CreateProductReviewImageDto[];
}
