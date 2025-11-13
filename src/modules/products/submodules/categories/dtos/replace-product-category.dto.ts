import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { CreateProductCategoryDto } from '@/modules/products/submodules/categories/dtos/create-product-category.dto';
import { IReplaceProductCategory } from '@/modules/products/submodules/categories/types';

export class ReplaceProductCategoryDto
  extends CreateProductCategoryDto
  implements IReplaceProductCategory
{
  @ApiProperty()
  @IsBoolean()
  isArchived!: boolean;
}
