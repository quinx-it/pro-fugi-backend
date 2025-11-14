import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, ValidateNested } from 'class-validator';

import { ICreateProductOrderItem } from '@/modules/products/submodules/orders/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductOrderItemAsAdminDto
  implements ICreateProductOrderItem
{
  @ApiProperty()
  @IsInt()
  count!: number;

  @ApiProperty({ type: IdentityDto })
  @Type(() => IdentityDto)
  @ValidateNested()
  productItem!: IdentityDto;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsNumber()
  customPricePerProductItem!: number | null;
}
