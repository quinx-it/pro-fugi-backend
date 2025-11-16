import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IUpdateProductOrder } from '@/modules/products/submodules/orders/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateProductOrderDto implements IUpdateProductOrder {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  manualPriceAdjustment?: number;

  @ApiProperty({ type: 'string', nullable: true, default: null })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  address?: string | null;

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
