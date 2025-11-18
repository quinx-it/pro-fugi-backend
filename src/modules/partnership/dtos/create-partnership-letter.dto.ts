import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

import { ICreatePartnershipLetter } from '@/modules/partnership/types';

export class CreatePartnershipLetterDto implements ICreatePartnershipLetter {
  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  text!: string;
}
