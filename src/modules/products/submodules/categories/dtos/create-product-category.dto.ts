import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { ProductSpecificationSchemaAttributeDto } from '@/modules/products/submodules/categories/dtos/product-specification-schema-attribute.dto';
import { ValidSpecificationSchema } from '@/modules/products/submodules/categories/dtos/validators/validate-specification-schema';
import { ICreateProductCategory } from '@/modules/products/submodules/categories/types';

export class CreateProductCategoryDto implements ICreateProductCategory {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ type: ProductSpecificationSchemaAttributeDto, isArray: true })
  @IsArray()
  @Type(() => ProductSpecificationSchemaAttributeDto)
  @ValidateNested({ each: true })
  @ValidSpecificationSchema()
  specificationSchema!: ProductSpecificationSchemaAttributeDto[];
}
