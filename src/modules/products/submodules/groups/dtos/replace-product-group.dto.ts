import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IReplaceProductGroup } from '@/modules/products/submodules/groups/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class ReplaceProductGroupDto implements IReplaceProductGroup {
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
}
