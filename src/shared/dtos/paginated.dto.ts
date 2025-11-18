import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import { IPaginated } from '@/shared';

export abstract class PaginatedDto<T> implements IPaginated<T> {
  @ApiProperty()
  @IsNumber()
  page!: number;

  @ApiProperty()
  @IsNumber()
  limit!: number;

  @ApiProperty()
  @IsNumber()
  offset!: number;

  @ApiProperty()
  @IsNumber()
  totalPagesCount!: number;

  @ApiProperty()
  @IsNumber()
  totalItemsCount!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasPrevious!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasNext!: boolean;

  abstract items: T[];
}
