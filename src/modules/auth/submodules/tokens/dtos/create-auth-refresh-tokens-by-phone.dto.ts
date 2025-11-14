import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

import { ICreateAuthRefreshTokenByPhone } from '@/modules/auth/submodules/tokens/types';

export class CreateAuthRefreshTokensByPhoneDto
  implements ICreateAuthRefreshTokenByPhone
{
  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
