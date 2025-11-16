import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { ProductDiscountType } from '@/modules/products/submodules/orders/constants';
import { IProductDiscount } from '@/modules/products/submodules/orders/types';

export class ProductDiscountDto implements IProductDiscount {
  @ApiProperty()
  @IsEnum(ProductDiscountType)
  type!: ProductDiscountType;

  @ApiProperty()
  @IsNumber()
  value!: number;
}
