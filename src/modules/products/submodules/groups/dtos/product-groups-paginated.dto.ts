import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ProductGroupDto } from '@/modules/products/submodules/groups/dtos/product-group.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class ProductGroupsPaginatedDto extends PaginatedDto<ProductGroupDto> {
  @ApiProperty({ type: ProductGroupDto, isArray: true })
  @IsArray()
  @Type(() => ProductGroupDto)
  @ValidateNested({ each: true })
  items!: ProductGroupDto[];
}
