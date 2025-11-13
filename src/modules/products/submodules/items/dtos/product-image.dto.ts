import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { ProductImageType } from '@/modules/products/submodules/items/constants';
import { IProductImage } from '@/modules/products/submodules/items/types';

export class ProductImageDto implements IProductImage {
  @Exclude()
  id!: number;

  @Exclude()
  productItemId!: number;

  @ApiProperty()
  @IsString()
  fileName!: string;

  @ApiProperty()
  @IsEnum(ProductImageType)
  type!: ProductImageType;
}
