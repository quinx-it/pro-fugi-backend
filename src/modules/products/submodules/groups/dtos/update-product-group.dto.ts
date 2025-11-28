import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IUpdateProductGroup } from '@/modules/products/submodules/groups/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateProductGroupDto implements IUpdateProductGroup {
  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  imageFileName?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
