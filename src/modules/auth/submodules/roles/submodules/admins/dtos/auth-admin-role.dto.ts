import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt } from 'class-validator';

import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class AuthAdminRoleDto implements IAuthAdminRole {
  @ApiProperty()
  @IsInt()
  id!: number;

  @Exclude()
  userId!: number;

  @Exclude()
  createdAt!: Date;
}
