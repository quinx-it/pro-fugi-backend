import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ProductOrderDto } from '@/modules/products/submodules/orders/dtos/product-order.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class ProductOrdersPaginatedDto extends PaginatedDto<ProductOrderDto> {
  @ApiProperty({ type: ProductOrderDto, isArray: true })
  @IsArray()
  @Type(() => ProductOrderDto)
  @ValidateNested({ each: true })
  items!: ProductOrderDto[];
}
