import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsInt, IsNumber, ValidateNested } from 'class-validator';

import { ProductItemDto } from '@/modules/products/submodules/items/dtos';
import {
  IProductOrder,
  IProductOrderItem,
} from '@/modules/products/submodules/orders/types';

export class ProductOrderItemDto implements IProductOrderItem {
  @ApiProperty()
  @IsInt()
  count!: number;

  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty({ type: () => ProductItemDto })
  @Type(() => ProductItemDto)
  @ValidateNested()
  productItem!: ProductItemDto;

  @Exclude()
  productItemId!: number;

  @Exclude()
  productOrder?: IProductOrder;

  @Exclude()
  productOrderId!: number;

  @ApiProperty()
  @IsNumber()
  pricePerProductItem!: number;

  @ApiProperty()
  @IsNumber()
  totalPrice!: number;
}
