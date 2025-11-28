import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ProductCategoryWithNoSchemaDto } from '@/modules/products/submodules/categories/dtos';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { ProductItemDto } from '@/modules/products/submodules/items/dtos';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductGroupDto implements IProductGroup {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  imageFileName!: string | null;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ type: ProductCategoryWithNoSchemaDto })
  @IsOptional()
  @Type(() => ProductCategoryWithNoSchemaDto)
  @ValidateNested()
  productCategory?: ProductCategoryWithNoSchemaDto;

  @Exclude()
  productCategoryId!: number;

  @ApiProperty({ type: ProductItemDto, isArray: true })
  @IsOptional()
  @Type(() => ProductItemDto)
  @ValidateNested({ each: true })
  productItems?: ProductItemDto[];
}
