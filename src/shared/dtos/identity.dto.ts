import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

import { IIdentifiable } from '@/shared';

export class IdentityDto implements IIdentifiable {
  @ApiProperty()
  @IsInt()
  id!: number;
}
