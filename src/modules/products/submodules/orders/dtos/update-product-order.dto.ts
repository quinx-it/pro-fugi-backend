import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IUpdateProductOrder } from '@/modules/products/submodules/orders/types';

export class UpdateProductOrderDto implements IUpdateProductOrder {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  correctionPrice?: number;

  @ApiProperty()
  @IsOptional()
  @ValidateIf((obj) => obj.adress !== null)
  @IsString()
  address?: string | null;

  @ApiProperty()
  @IsOptional()
  @ValidateIf((obj) => obj.adress !== null)
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
