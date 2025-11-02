import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ICreateAuthTokensByRefresh } from '@/modules/auth/submodules/tokens/types';

export class CreateAuthTokensByRefreshDto
  implements ICreateAuthTokensByRefresh
{
  @ApiProperty()
  @IsString()
  refresh!: string;
}
