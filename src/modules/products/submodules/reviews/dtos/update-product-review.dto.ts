import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { ICreateProductReview } from '@/modules/products/submodules/reviews/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateProductReviewDto implements Partial<ICreateProductReview> {
  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  text?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  rating?: number;
}
