import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { IPartnershipLetter } from '@/modules/partnership/types';

export class PartnershipLetterDto implements IPartnershipLetter {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  text!: string;

  @ApiProperty()
  @IsBoolean()
  isRead!: boolean;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;
}
