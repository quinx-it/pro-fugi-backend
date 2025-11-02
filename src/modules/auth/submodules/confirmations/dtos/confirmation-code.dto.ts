import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsDate, IsDefined, IsString } from 'class-validator';

import { IConfirmationCodeEntity } from '@/modules/auth/submodules/confirmations/types';

export class ConfirmationCodeDto implements IConfirmationCodeEntity {
  @ApiProperty()
  @IsString()
  subject!: string;

  @ApiProperty()
  @IsDate()
  expiresAt!: Date;

  @ApiProperty()
  @IsDefined()
  params!: object;

  @Exclude()
  value!: string;
}
