import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { ProductDiscountDto } from '@/modules/products/submodules/orders/dtos/product-discount.dto';
import { IProductCustomerDiscount } from '@/modules/products/submodules/orders/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductCustomerDiscountDto implements IProductCustomerDiscount {
  @ApiProperty({ type: () => ProductDiscountDto, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => ProductDiscountDto)
  @ValidateNested()
  discount!: ProductDiscountDto | null;

  @ApiProperty()
  @IsNumber()
  totalOrdersSum!: number;

  @ApiProperty({ type: 'number', nullable: true })
  @DtosUtil.isNullable()
  @IsNumber()
  currentThreshold!: number | null;

  @ApiProperty({ type: 'number', nullable: true })
  @DtosUtil.isNullable()
  @IsNumber()
  nextThreshold!: number | null;
}
