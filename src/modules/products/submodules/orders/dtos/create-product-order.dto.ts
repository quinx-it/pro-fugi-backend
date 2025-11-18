import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsString, ValidateNested } from 'class-validator';

import { ProductOrderDeliveryType } from '@/modules/products/submodules/orders/constants';
import { CreateProductOrderItemDto } from '@/modules/products/submodules/orders/dtos/create-product-order-item.dto';
import { ICreateProductOrder } from '@/modules/products/submodules/orders/types';
import { AddressDto } from '@/shared/dtos/address.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductOrderDto implements ICreateProductOrder {
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  comment!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  phoneIfNotDefault!: string | null;

  @ApiProperty({ type: AddressDto, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => AddressDto)
  @ValidateNested()
  addressIfNotDefault!: AddressDto | null;

  @ApiProperty({ enum: ProductOrderDeliveryType })
  @IsIn(Object.values(ProductOrderDeliveryType))
  deliveryType!: ProductOrderDeliveryType;

  @ApiProperty({ type: CreateProductOrderItemDto, isArray: true })
  @IsArray()
  @Type(() => CreateProductOrderItemDto)
  @ValidateNested({ each: true })
  productOrderItems!: CreateProductOrderItemDto[];
}
