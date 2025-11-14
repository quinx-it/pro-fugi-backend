import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthRolePayload } from '@/modules/auth/submodules/users/types';

export class AuthRolePayloadDto implements IAuthRolePayload {
  @ApiProperty()
  @IsNumber()
  userId!: number;

  @ApiProperty()
  @IsNumber()
  roleId!: number;

  @ApiProperty()
  @IsEnum(AuthRole)
  role!: AuthRole;
}
