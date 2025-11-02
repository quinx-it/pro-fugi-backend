import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined } from 'class-validator';

import { IPagination } from '@/shared/types';

export class PaginationDto implements IPagination {
  @ApiProperty({ name: 'page', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'page' })
  page!: number;

  @ApiProperty({ name: 'limit', example: 15 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'limit' })
  limit!: number;

  @ApiProperty({ name: 'offset', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'offset' })
  offset!: number;
}
