import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { ICreateAuthAccessTokenByRefresh } from '@/modules/auth/submodules/tokens/types';

export class CreateAuthAccessTokenByRefreshDto
  implements ICreateAuthAccessTokenByRefresh
{
  @ApiProperty()
  @IsString()
  refresh!: string;

  @ApiProperty()
  @IsEnum(AuthRole)
  authRole!: AuthRole | null;
}
