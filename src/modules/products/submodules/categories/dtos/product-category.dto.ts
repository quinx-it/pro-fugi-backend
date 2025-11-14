import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ValidSpecificationSchema } from '@/modules/products/submodules/categories/dtos/validators/validate-specification-schema';
import {
  IProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';

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

  @ApiProperty({ type: 'object' })
  @IsArray()
  @ValidateNested({ each: true })
  @ValidSpecificationSchema()
  specificationSchema!: IProductSpecificationSchema;
}
