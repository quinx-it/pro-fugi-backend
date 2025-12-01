import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { IUpdateProductGroup } from '@/modules/products/submodules/groups/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';
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

  @ApiProperty({ type: IdentityDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => IdentityDto)
  @ValidateNested({ each: true })
  productItems?: IdentityDto[];
}
