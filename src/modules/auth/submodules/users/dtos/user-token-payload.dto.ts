import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { IUserTokenPayload } from '@/modules/auth/submodules/users/types';

export class UserTokenPayloadDto implements IUserTokenPayload {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsEnum(AuthRole, { each: true })
  roles!: AuthRole[];
}
