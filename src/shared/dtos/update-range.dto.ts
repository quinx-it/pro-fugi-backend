import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IRange } from '@/shared';

export class UpdateRangeDto<T> implements Partial<IRange<T>> {
  @ApiProperty({ example: 'unknown' })
  @IsOptional()
  min?: T;

  @ApiProperty({ example: 'unknown' })
  @IsOptional()
  max?: T;
}
