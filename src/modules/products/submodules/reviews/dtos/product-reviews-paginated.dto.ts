import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ProductReviewDto } from '@/modules/products/submodules/reviews/dtos/product-review.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class ProductReviewsPaginatedDto extends PaginatedDto<ProductReviewDto> {
  @ApiProperty({ type: ProductReviewDto, isArray: true })
  @IsArray()
  @Type(() => ProductReviewDto)
  @ValidateNested({ each: true })
  items!: ProductReviewDto[];
}
