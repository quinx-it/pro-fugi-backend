import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ProductOrderDeliveryType } from '@/modules/products/submodules/orders/constants';
import { CreateProductOrderItemAsAdminDto } from '@/modules/products/submodules/orders/dtos/create-product-order-item-as-admin.dto';
import { CreateProductOrderItemDto } from '@/modules/products/submodules/orders/dtos/create-product-order-item.dto';
import { ICreateProductOrderAsAdmin } from '@/modules/products/submodules/orders/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductOrderAsAdminDto
  implements ICreateProductOrderAsAdmin
{
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  comment!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  phoneIfNotDefault!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  addressIfNotDefault!: string | null;

  @ApiProperty({ enum: ProductOrderDeliveryType })
  @IsIn(Object.values(ProductOrderDeliveryType))
  deliveryType!: ProductOrderDeliveryType;

  @ApiProperty({ type: CreateProductOrderItemAsAdminDto, isArray: true })
  @IsArray()
  @Type(() => CreateProductOrderItemDto)
  @ValidateNested({ each: true })
  productOrderItems!: CreateProductOrderItemAsAdminDto[];

  @ApiProperty()
  @IsInt()
  authCustomerRoleId!: number;
}
