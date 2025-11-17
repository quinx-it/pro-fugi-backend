import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ProductOrderDeliveryType,
  ProductOrderStatus,
} from '@/modules/products/submodules/orders/constants';
import { IProductOrdersSearchView } from '@/modules/products/submodules/orders/types';
import { IFilter, IPagination, ISort } from '@/shared';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class FindProductOrdersDto
  implements
    IFilter<IProductOrdersSearchView>,
    Partial<ISort<IProductOrdersSearchView>>,
    Partial<IPagination>
{
  @ApiProperty({
    name: 'auth_customer_role_id_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'auth_customer_role_id_in' })
  authCustomerRoleIdIn?: number[];

  @ApiProperty({
    name: 'product_item_ids_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'product_item_ids_contain' })
  productItemIdsContain?: number[];

  @ApiProperty({
    name: 'product_item_ids_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'product_item_ids_in' })
  productItemIdsIn?: number[];

  @ApiProperty({
    name: 'auth_customer_role_name_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'auth_customer_role_name_contains' })
  authCustomerRoleNameContains?: string;

  @ApiProperty({
    name: 'auth_customer_role_name_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'auth_customer_role_name_in' })
  authCustomerRoleNameIn?: string[];

  @ApiProperty({
    name: 'product_item_names_contain',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'product_item_names_contain' })
  productItemNamesContain?: string;

  @ApiProperty({
    name: 'product_item_names_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'product_item_names_in' })
  productItemNamesIn?: string[];

  @ApiProperty({
    name: 'status_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @IsArray()
  @IsIn(Object.values(ProductOrderStatus), { each: true })
  @Expose({ name: 'status_in' })
  statusIn?: ProductOrderStatus[];

  @ApiProperty({
    name: 'delivery_type_in',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @IsArray()
  @IsIn(Object.values(ProductOrderDeliveryType), { each: true })
  @Expose({ name: 'delivery_type_in' })
  deliveryTypeIn?: ProductOrderDeliveryType[];

  @ApiProperty({ name: 'total_price_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'total_price_min' })
  totalPriceMin?: number;

  @ApiProperty({ name: 'total_price_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'total_price_max' })
  totalPriceMax?: number;

  @ApiProperty({ name: 'product_items_price_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'product_items_price_min' })
  productItemsPriceMin?: number;

  @ApiProperty({ name: 'product_items_price_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'product_items_price_max' })
  productItemsPriceMax?: number;

  @ApiProperty({ name: 'delivery_price_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'shipping_price_min' })
  deliveryPriceMin?: number;

  @ApiProperty({ name: 'delivery_price_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'shipping_price_max' })
  deliveryPriceMax?: number;

  @ApiProperty({ name: 'created_at_min', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'created_at_min' })
  createdAtMin?: Date;

  @ApiProperty({ name: 'created_at_max', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'created_at_max' })
  createdAtMax?: Date;

  // region Pagination

  @ApiProperty({ name: 'page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'page' })
  page?: number;

  @ApiProperty({ name: 'limit', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'limit' })
  limit?: number;

  @ApiProperty({ name: 'offset', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'offset' })
  offset?: number;

  // endregion

  // region Sorting

  @ApiProperty({ name: 'sort_by', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'sort_by' })
  sortBy?: keyof IProductOrdersSearchView;

  @ApiProperty({ name: 'descending', required: false })
  @IsOptional()
  @Transform(({ value }) => DtosUtil.parseBooleanValue(value))
  @Expose({ name: 'descending' })
  @IsBoolean()
  descending?: boolean;

  // endregion

  get pagination(): IPagination | undefined {
    const { page, limit, offset } = this;

    if (page !== undefined && limit !== undefined && offset !== undefined) {
      return { page, limit, offset };
    }

    return undefined;
  }

  get sort(): ISort<IProductOrdersSearchView> | undefined {
    const { sortBy, descending } = this;

    if (sortBy !== undefined && descending !== undefined) {
      return { sortBy, descending };
    }

    return undefined;
  }

  get filter(): IFilter<IProductOrdersSearchView> {
    const {
      authCustomerRoleIdIn,
      authCustomerRoleNameContains,
      authCustomerRoleNameIn,
      deliveryTypeIn,
      productItemIdsContain,
      productItemIdsIn,
      productItemNamesContain,
      productItemNamesIn,
      statusIn,
      deliveryPriceMax,
      deliveryPriceMin,
      totalPriceMax,
      totalPriceMin,
      productItemsPriceMin,
      productItemsPriceMax,
      createdAtMax,
      createdAtMin,
    } = this;

    return {
      authCustomerRoleIdIn,
      authCustomerRoleNameContains,
      authCustomerRoleNameIn,
      deliveryTypeIn,
      productItemIdsContain,
      productItemIdsIn,
      productItemNamesContain,
      productItemNamesIn,
      statusIn,
      deliveryPriceMax,
      deliveryPriceMin,
      totalPriceMax,
      totalPriceMin,
      productItemsPriceMin,
      productItemsPriceMax,
      createdAtMax,
      createdAtMin,
    };
  }
}
