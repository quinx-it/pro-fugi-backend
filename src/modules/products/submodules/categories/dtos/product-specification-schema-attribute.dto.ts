import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { IProductSpecificationSchemaAttribute } from '@/modules/products/submodules/items/types';
import { RangeDto } from '@/shared/dtos/range.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ProductSpecificationSchemaAttributeDto
  implements IProductSpecificationSchemaAttribute
{
  @ApiProperty({ type: String, isArray: true, nullable: true })
  @DtosUtil.isNullable()
  @IsArray()
  @IsString({ each: true })
  enumeration!: string[] | null;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ type: RangeDto, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => RangeDto)
  @ValidateNested()
  range!: RangeDto<number> | null;
}
