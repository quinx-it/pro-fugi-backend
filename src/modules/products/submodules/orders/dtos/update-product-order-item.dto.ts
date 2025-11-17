import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { IUpdateProductOrderItemAsAdmin } from '@/modules/products/submodules/orders/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';

export class UpdateProductOrderItemDto
  implements IUpdateProductOrderItemAsAdmin
{
  @ApiProperty()
  @IsOptional()
  @IsInt()
  count?: number;

  @ApiProperty({ type: IdentityDto })
  @IsOptional()
  @Type(() => IdentityDto)
  @ValidateNested()
  productItem?: IdentityDto;

  @ApiProperty({ type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  pricePerProductItemIfNotDefault?: number | null;
}
