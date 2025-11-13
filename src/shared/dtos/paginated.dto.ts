import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';

import { IPaginated } from '@/shared';

export abstract class PaginatedDto<T> implements IPaginated<T> {
  abstract get dtoItemClass(): ClassConstructor<T>;

  @ApiProperty({ example: 0 })
  @IsNumber()
  page!: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  limit!: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  offset!: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  totalPagesCount!: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  totalItemsCount!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasPrevious!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasNext!: boolean;

  @ApiProperty()
  @Type((options) => {
    const { object } = options!;

    const { dtoItemClass } = object as PaginatedDto<T>;

    return dtoItemClass;
  })
  @ValidateNested({ each: true })
  items!: T[];
}
