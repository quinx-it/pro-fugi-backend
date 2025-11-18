import { Exclude } from 'class-transformer';

import {
  IProductOrder,
  IProductOrderAddress,
} from '@/modules/products/submodules/orders/types';
import { AddressDto } from '@/shared/dtos/address.dto';

export class ProductOrderAddressDto
  extends AddressDto
  implements IProductOrderAddress
{
  @Exclude()
  id!: number;

  @Exclude()
  productOrder?: IProductOrder;

  @Exclude()
  productOrderId!: number;
}
