import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';

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
  specificationSchema!: IProductSpecificationSchemaAttribute[];
}
