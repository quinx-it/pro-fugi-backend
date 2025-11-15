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

export class CreateProductItemDto implements ICreateProductItem {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  price!: number;

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
