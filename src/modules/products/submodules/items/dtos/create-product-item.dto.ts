import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateProductImageDto } from '@/modules/products/submodules/items/dtos/create-product-image.dto';
import {
  ICreateProductItem,
  IProductSpecification,
} from '@/modules/products/submodules/items/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateProductItemDto implements ICreateProductItem {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  basePrice!: number;

  @ApiProperty({ type: 'number', nullable: true, default: null })
  @DtosUtil.isNullable()
  @IsNumber()
  discountValue!: number | null;

  @ApiProperty({ type: 'number', nullable: true, default: null })
  @DtosUtil.isNullable()
  @IsNumber()
  discountPercentage!: number | null;

  @ApiProperty()
  @IsNumber()
  inStockNumber!: number;

  @ApiProperty()
  @IsBoolean()
  isArchived!: boolean;

  @ApiProperty({ type: 'object' })
  @IsDefined()
  specification!: IProductSpecification;

  @ApiProperty({ type: IdentityDto })
  @Type(() => IdentityDto)
  @ValidateNested()
  productCategory!: IdentityDto;

  @ApiProperty({ type: CreateProductImageDto, isArray: true })
  @IsArray()
  @Type(() => CreateProductImageDto)
  @ValidateNested({ each: true })
  productImages!: CreateProductImageDto[];
}
