import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ProductCategoryWithNoSchemaDto } from '@/modules/products/submodules/categories/dtos/product-category-with-no-schema.dto';
import { ProductImageDto } from '@/modules/products/submodules/items/dtos/product-image.dto';
import {
  IProductItem,
  IProductPrice,
  IProductSpecification,
} from '@/modules/products/submodules/items/types';
import { ProductOrderItemDto } from '@/modules/products/submodules/orders/dtos/product-order-item.dto';
import { IProductReview } from '@/modules/products/submodules/reviews/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductItemDto implements IProductItem {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsNumber()
  price!: number | null;

  @ApiProperty()
  @IsNumber()
  inStockNumber!: number;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsNumber()
  rating!: number | null;

  @Exclude()
  productPrices?: IProductPrice[];

  @Exclude()
  productReviews?: IProductReview[];

  @ApiProperty({ type: () => ProductImageDto, isArray: true })
  @IsArray()
  @Type(() => ProductImageDto)
  @ValidateNested({ each: true })
  productImages?: ProductImageDto[];

  @ApiProperty({ type: () => ProductOrderItemDto, isArray: true })
  @IsArray()
  @Type(() => ProductOrderItemDto)
  @ValidateNested({ each: true })
  productOrders?: ProductOrderItemDto[];

  @ApiProperty({ type: () => ProductCategoryWithNoSchemaDto })
  @Type(() => ProductCategoryWithNoSchemaDto)
  @ValidateNested()
  productCategory?: ProductCategoryWithNoSchemaDto;

  @ApiProperty()
  @IsNumber()
  productCategoryId!: number;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;

  @ApiProperty()
  @IsBoolean()
  isArchived!: boolean;

  @ApiProperty({ type: 'object' })
  @IsDefined()
  specification!: IProductSpecification;
}
