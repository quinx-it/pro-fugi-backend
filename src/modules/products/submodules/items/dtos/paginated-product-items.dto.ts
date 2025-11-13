import { ClassConstructor } from 'class-transformer';

import { ProductItemDto } from '@/modules/products/submodules/items/dtos/product-item.dto';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PaginatedProductItemsDto extends PaginatedDto<IProductItem> {
  get dtoItemClass(): ClassConstructor<IProductItem> {
    return ProductItemDto;
  }
}
