import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

import { ICreateProductReview } from '@/modules/products/submodules/reviews/types';

export class UpdateProductReviewDto implements Partial<ICreateProductReview> {
  @ApiProperty()
  @IsOptional()
  @ValidateIf((obj) => obj.text !== null)
  @IsString()
  text?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  rating?: number;
}
