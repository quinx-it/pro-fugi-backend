import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { IReplaceProductGroup } from '@/modules/products/submodules/groups/types';
import { PRODUCT_ITEMS_IMAGES_PATH } from '@/modules/products/submodules/items/constants';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';
import { IsFileLocated } from '@/shared/validators/is-located';

export class ReplaceProductGroupDto implements IReplaceProductGroup {
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  @IsFileLocated(PRODUCT_ITEMS_IMAGES_PATH)
  imageFileName!: string | null;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ type: IdentityDto, isArray: true })
  @IsArray()
  @Type(() => IdentityDto)
  @ValidateNested({ each: true })
  productItems!: IdentityDto[];
}
