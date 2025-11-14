import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class AuthPayloadDto implements IAuthPayload {
  @ApiProperty()
  @IsNumber()
  authUserId!: number;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsNumber()
  authCustomerRoleId!: number | null;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsNumber()
  authAdminRoleId!: number | null;

  @ApiProperty()
  @IsEnum(AuthRole, { each: true })
  authRoles!: AuthRole[];
}
