import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsPhoneNumber, IsString } from 'class-validator';

import { ICreatePhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';

export class CreatePhoneAuthMethodDto implements ICreatePhoneMethod {
  @ApiProperty()
  @IsString()
  confirmationCode!: string;

  @ApiProperty()
  @IsBoolean()
  isNewUser!: boolean;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
