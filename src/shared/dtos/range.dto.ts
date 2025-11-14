import { ApiProperty } from '@nestjs/swagger';

import { IRange } from '@/shared';

export class RangeDto<T> implements Partial<IRange<T>> {
  @ApiProperty({ example: 'unknown' })
  min?: T;

  @ApiProperty({ example: 'unknown' })
  max?: T;
}
