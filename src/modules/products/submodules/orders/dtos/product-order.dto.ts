import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/auth-customer-role.dto';
import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { ProductOrderItemDto } from '@/modules/products/submodules/orders/dtos/product-order-item.dto';
import { IProductOrder } from '@/modules/products/submodules/orders/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductOrderDto implements IProductOrder {
  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  address!: string | null;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  comment!: string | null;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ type: AuthCustomerRoleDto })
  @IsOptional()
  @Type(() => AuthCustomerRoleDto)
  @ValidateNested()
  authCustomerRole?: AuthCustomerRoleDto;

  @Exclude()
  authCustomerRoleId!: number;

  @ApiProperty()
  @IsIn(Object.values(ProductOrderDeliveryType))
  deliveryType!: ProductOrderDeliveryType;

  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsNumber()
  productItemsPrice!: number;

  @Exclude()
  orderItemIds!: number[];

  @ApiProperty({ type: ProductOrderItemDto, isArray: true })
  @IsOptional()
  @Type(() => ProductOrderItemDto)
  @ValidateNested({ each: true })
  productOrderItems!: ProductOrderItemDto[];

  @ApiProperty()
  @IsNumber()
  deliveryPrice!: number;

  @ApiProperty()
  @IsNumber()
  manualPriceAdjustment!: number;

  @Exclude()
  configFreeShippingThreshold!: number;

  @Exclude()
  configShippingPrice!: number;

  @ApiProperty()
  @IsIn(Object.values(ProductOrderStatus))
  status!: ProductOrderStatus;

  @ApiProperty()
  @IsNumber()
  totalPrice!: number;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;
}
