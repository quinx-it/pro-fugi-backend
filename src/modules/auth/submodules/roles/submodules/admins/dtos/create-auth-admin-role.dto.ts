import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ICreateAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class CreateAuthAdminRoleDto implements ICreateAuthAdminRole {
  @ApiProperty({ type: 'string' })
  @IsString()
  name!: string;
}
