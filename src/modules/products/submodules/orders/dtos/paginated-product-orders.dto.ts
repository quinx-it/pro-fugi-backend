import { ClassConstructor } from 'class-transformer';

import { ProductOrderDto } from '@/modules/products/submodules/orders/dtos/product-order.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PaginatedProductOrdersDto extends PaginatedDto<ProductOrderDto> {
  get dtoItemClass(): ClassConstructor<ProductOrderDto> {
    return ProductOrderDto;
  }
}
