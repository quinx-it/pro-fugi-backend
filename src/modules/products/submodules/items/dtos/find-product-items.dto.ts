import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import camelcaseKeys from 'camelcase-keys';
import { Expose, Type, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ProductSpecificationAttributeDto } from '@/modules/products/submodules/items/entities';
import { IProductItemSearchView } from '@/modules/products/submodules/items/types';
import {
  AppException,
  ERROR_MESSAGES,
  IFilter,
  IPagination,
  ISort,
} from '@/shared';

export class FindProductItemsDto
  implements
    IFilter<IProductItemSearchView>,
    ISort<IProductItemSearchView>,
    IPagination
{
  @ApiProperty({ name: 'name_contains', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'name_contains' })
  nameContains?: string;

  @ApiProperty({ name: 'description_contains', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'description_contains' })
  descriptionContains?: string;

  @ApiProperty({ name: 'product_category_id', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'product_category_id' })
  productCategoryId?: number;

  @ApiProperty({ name: 'in_stock_count_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'in_stock_count_min' })
  inStockCountMin?: number;

  @ApiProperty({ name: 'in_stock_count_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'in_stock_count_max' })
  inStockCountMax?: number;

  @ApiProperty({ name: 'rating_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'rating_min' })
  ratingMin?: number;

  @ApiProperty({ name: 'rating_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'rating_max' })
  ratingMax?: number;

  @ApiProperty({ name: 'price_min', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'price_min' })
  priceMin?: number;

  @ApiProperty({ name: 'price_max', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'price_max' })
  priceMax?: number;

  // region Pagination

  @ApiProperty({ name: 'page', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'page' })
  page!: number;

  @ApiProperty({ name: 'limit', example: 15 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'limit' })
  limit!: number;

  @ApiProperty({ name: 'offset', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'offset' })
  offset!: number;

  // endregion

  // region Sorting

  @ApiProperty({ name: 'sort_by', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'sort_by' })
  sortBy: keyof IProductItemSearchView = 'id';

  @ApiProperty({ name: 'descending', required: false })
  @IsOptional()
  @Transform(({ value }) => value === JSON.stringify(true))
  @Expose({ name: 'descending' })
  @IsBoolean()
  descending: boolean = false;

  // endregion

  @ApiProperty({
    name: 'specification',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @Transform(({ obj }) => {
    const { categoryId, specification } = camelcaseKeys(obj);

    if (!categoryId && specification) {
      throw new AppException(
        ERROR_MESSAGES.PRODUCT_ITEMS_SPECS_SEARCH_REQUIRES_CATEGORY_ID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (specification === undefined) {
      return [];
    }

    if (typeof specification === 'string') {
      return JSON.parse(specification);
    }

    return specification;
  })
  @Expose({ name: 'specification' })
  specification?: ProductSpecificationAttributeDto[];

  get pagination(): IPagination {
    const { page, limit, offset } = this;

    return { page, limit, offset };
  }

  get sort(): ISort<IProductItemSearchView> {
    const { sortBy, descending } = this;

    return { sortBy, descending };
  }

  get filter(): IFilter<IProductItemSearchView> {
    const {
      nameContains,
      descriptionContains,
      productCategoryId,
      priceMin,
      priceMax,
      ratingMin,
      ratingMax,
    } = this;

    return {
      nameContains,
      descriptionContains,
      productCategoryId,
      priceMin,
      priceMax,
      ratingMin,
      ratingMax,
    };
  }
}
