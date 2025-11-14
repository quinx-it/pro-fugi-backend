import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

import {
  IProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';

export class ProductCategoryWithNoSchemaDto implements IProductCategory {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsBoolean()
  isArchived!: boolean;

  @Exclude()
  specificationSchema!: IProductSpecificationSchema;
}
