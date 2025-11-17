import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, ValidateNested } from 'class-validator';

import { ICreateProductOrderItemAsAdmin } from '@/modules/products/submodules/orders/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductOrderItemAsAdminDto
  implements ICreateProductOrderItemAsAdmin
{
  @ApiProperty()
  @IsInt()
  count!: number;

  @ApiProperty({ type: IdentityDto })
  @Type(() => IdentityDto)
  @ValidateNested()
  productItem!: IdentityDto;

  @ApiProperty({ type: 'number', nullable: true })
  @DtosUtil.isNullable()
  @IsNumber()
  pricePerProductItemIfNotDefault!: number | null;
}
