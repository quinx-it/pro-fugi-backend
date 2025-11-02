import { ApiProperty } from '@nestjs/swagger';

import { IRange } from '@/shared';

export class RangeDto<T> implements Partial<IRange<T>> {
  @ApiProperty({ example: 'unknown' })
  min?: T;

  @ApiProperty({ example: 'unknown' })
  max?: T;

  constructor(range: Partial<IRange<T>>) {
    const { min, max } = range;

    this.min = min;
    this.max = max;
  }
}
