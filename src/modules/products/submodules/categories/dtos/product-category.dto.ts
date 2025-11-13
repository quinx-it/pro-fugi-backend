import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ProductSpecificationSchemaAttributeDto } from '@/modules/products/submodules/categories/dtos/product-specification-schema-attribute.dto';
import { ValidSpecificationSchema } from '@/modules/products/submodules/categories/dtos/validators/validate-specification-schema';
import { IProductCategory } from '@/modules/products/submodules/categories/types';

export class ProductCategoryDto implements IProductCategory {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsBoolean()
  isArchived!: boolean;

  @ApiProperty({ type: ProductSpecificationSchemaAttributeDto })
  @IsArray()
  @Type(() => ProductSpecificationSchemaAttributeDto)
  @ValidateNested({ each: true })
  @ValidSpecificationSchema()
  specificationSchema!: ProductSpecificationSchemaAttributeDto[];
}
