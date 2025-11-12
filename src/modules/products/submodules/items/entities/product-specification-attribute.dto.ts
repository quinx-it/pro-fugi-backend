import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

import { IProductSpecificationAttribute } from '@/modules/products/submodules/items/types';

export class ProductSpecificationAttributeDto
  implements IProductSpecificationAttribute
{
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => {
    if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      return Number(value);
    }

    return value;
  })
  value!: number | string;
}
