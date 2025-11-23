import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IUpdateAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class UpdateAuthAdminRoleDto implements IUpdateAuthAdminRole {
  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  name?: string;
}
