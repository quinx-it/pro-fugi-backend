import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IUpdateProductOrderAsAdmin } from '@/modules/products/submodules/orders/types';
import { AddressDto } from '@/shared/dtos/address.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateProductOrderDto implements IUpdateProductOrderAsAdmin {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  manualPriceAdjustment?: number;

  @ApiProperty({ type: AddressDto, nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @Type(() => AddressDto)
  @ValidateNested()
  addressIfNotDefault?: AddressDto | null;

  @ApiProperty({ type: 'string', nullable: true, default: null })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  phone?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(ProductOrderStatus))
  status?: ProductOrderStatus;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(ProductOrderDeliveryType))
  deliveryType?: ProductOrderDeliveryType;
}
