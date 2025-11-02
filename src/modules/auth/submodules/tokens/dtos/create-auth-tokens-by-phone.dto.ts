import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

import { ICreateAuthTokensByPhone } from '@/modules/auth/submodules/tokens/types';

export class CreateAuthTokensByPhoneDto implements ICreateAuthTokensByPhone {
  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
