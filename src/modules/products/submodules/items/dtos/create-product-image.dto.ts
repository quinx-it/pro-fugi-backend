import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import {
  PRODUCT_ITEMS_IMAGES_PATH,
  ProductImageType,
} from '@/modules/products/submodules/items/constants';
import { ICreateProductImage } from '@/modules/products/submodules/items/types';
import { IsFileLocated } from '@/shared/validators/is-located';

export class CreateProductImageDto implements ICreateProductImage {
  @ApiProperty()
  @IsString()
  @IsFileLocated(PRODUCT_ITEMS_IMAGES_PATH)
  fileName!: string;

  @ApiProperty()
  @IsEnum(ProductImageType)
  type!: ProductImageType;
}
