import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IUpdateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateAuthCustomerRoleDto implements IUpdateAuthCustomerRole {
  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  address?: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  firstName?: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  lastName?: string | null;
}
