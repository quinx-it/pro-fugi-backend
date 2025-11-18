import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { IUpdatePartnershipLetter } from '@/modules/partnership/types';

export class UpdatePartnershipLetterDto implements IUpdatePartnershipLetter {
  @ApiProperty()
  @IsIn([true])
  isRead!: true;
}
