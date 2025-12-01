import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { IReplaceProductGroup } from '@/modules/products/submodules/groups/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ReplaceProductGroupDto implements IReplaceProductGroup {
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
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
