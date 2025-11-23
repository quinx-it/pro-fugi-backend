import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

export class AuthAdminRoleDto implements IAuthAdminRole {
  @ApiProperty()
  @IsInt()
  id!: number;

  @Exclude()
  authUserId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @Exclude()
  createdAt!: Date;
}
