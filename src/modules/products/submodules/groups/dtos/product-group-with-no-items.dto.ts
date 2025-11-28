import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

import { IProductCategory } from '@/modules/products/submodules/categories/types';
import { IProductGroup } from '@/modules/products/submodules/groups/types';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductGroupWithNoItemsDto implements IProductGroup {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  imageFileName!: string | null;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @Exclude()
  productCategory?: IProductCategory;

  @ApiProperty()
  @IsInt()
  productCategoryId!: number;

  @Exclude()
  productItems?: IProductItem[];
}
