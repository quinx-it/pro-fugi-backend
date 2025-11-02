import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IAuthTokens } from '@/modules/auth/submodules/tokens/types';

export class AuthTokensDto implements IAuthTokens {
  @ApiProperty()
  @IsString()
  access!: string;

  @ApiProperty()
  @IsString()
  refresh!: string;
}
