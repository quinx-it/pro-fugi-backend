import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IDestroyProductFavourites } from '@/modules/products/submodules/favourites/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class DestroyProductFavouritesDto implements IDestroyProductFavourites {
  @ApiProperty({
    name: 'product_item_ids',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedIntArray)
  @Expose({ name: 'product_item_ids' })
  productItemIds?: number[];
}
