import { ClassConstructor } from 'class-transformer';

import { ProductCategoryDto } from '@/modules/products/submodules/categories/dtos/product-category.dto';
import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PaginatedProductCategoriesDto extends PaginatedDto<IProductCategory> {
  get dtoItemClass(): ClassConstructor<IProductCategory> {
    return ProductCategoryDto;
  }
}
