import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateProductImageDto } from '@/modules/products/submodules/items/dtos/create-product-image.dto';
import {
  IProductSpecification,
  IUpdateProductItem,
} from '@/modules/products/submodules/items/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateProductItemDto implements IUpdateProductItem {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ type: 'number', nullable: true, default: null })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsNumber()
  discountValue?: number | null;

  @ApiProperty({ type: 'number', nullable: true, default: null })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsNumber()
  discountPercentage?: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  inStockNumber?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ type: 'object' })
  @IsOptional()
  @IsDefined()
  specification?: IProductSpecification;

  @ApiProperty({ type: IdentityDto })
  @IsOptional()
  @Type(() => IdentityDto)
  @ValidateNested()
  productCategory?: IdentityDto;

  @ApiProperty({ type: IdentityDto })
  @IsOptional()
  @DtosUtil.isNullable()
  @Type(() => IdentityDto)
  @ValidateNested()
  productGroup?: IdentityDto | null;

  @ApiProperty({ type: CreateProductImageDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => CreateProductImageDto)
  @ValidateNested({ each: true })
  productImages?: CreateProductImageDto[];
}
