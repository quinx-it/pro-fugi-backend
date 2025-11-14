import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ValidSpecificationSchema } from '@/modules/products/submodules/categories/dtos/validators/validate-specification-schema';
import {
  ICreateProductCategory,
  IProductSpecificationSchema,
} from '@/modules/products/submodules/categories/types';

export class CreateProductCategoryDto implements ICreateProductCategory {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ type: 'object' })
  @ValidSpecificationSchema()
  specificationSchema!: IProductSpecificationSchema;
}
