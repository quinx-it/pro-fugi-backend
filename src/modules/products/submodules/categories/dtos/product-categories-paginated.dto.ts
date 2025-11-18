import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ProductCategoryDto } from '@/modules/products/submodules/categories/dtos/product-category.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class ProductCategoriesPaginatedDto extends PaginatedDto<ProductCategoryDto> {
  @ApiProperty({ type: ProductCategoryDto, isArray: true })
  @IsArray()
  @Type(() => ProductCategoryDto)
  @ValidateNested({ each: true })
  items!: ProductCategoryDto[];
}
