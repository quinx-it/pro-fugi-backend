import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ProductItemDto } from '@/modules/products/submodules/items/dtos/product-item.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class ProductItemsPaginatedDto extends PaginatedDto<ProductItemDto> {
  @ApiProperty({ type: ProductItemDto, isArray: true })
  @IsArray()
  @Type(() => ProductItemDto)
  @ValidateNested({ each: true })
  items!: ProductItemDto[];
}
