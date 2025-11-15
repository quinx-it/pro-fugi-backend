import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';

import { ICreateProductOrderItem } from '@/modules/products/submodules/orders/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';

export class CreateProductOrderItemDto implements ICreateProductOrderItem {
  @ApiProperty()
  @IsInt()
  count!: number;

  @ApiProperty({ type: IdentityDto })
  @Type(() => IdentityDto)
  @ValidateNested()
  productItem!: IdentityDto;

  customPricePerProductItem: number | null = 0;
}
