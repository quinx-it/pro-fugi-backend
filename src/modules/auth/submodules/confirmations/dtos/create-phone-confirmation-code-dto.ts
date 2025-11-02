import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsPhoneNumber } from 'class-validator';

import { ICreatePhoneConfirmationCode } from '@/modules/auth/submodules/confirmations/types';

export class CreatePhoneConfirmationCodeDto
  implements ICreatePhoneConfirmationCode
{
  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsBoolean()
  isNewUser!: boolean;
}
