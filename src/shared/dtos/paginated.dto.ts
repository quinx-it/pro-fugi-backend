import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';

import { IPaginated } from '@/shared';

export abstract class PaginatedDto<T> implements IPaginated<T> {
  abstract get dtoItemClass(): ClassConstructor<T>;

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

  @ApiProperty()
  @Type((options) => {
    const { object } = options!;

    const { dtoItemClass } = object as PaginatedDto<T>;

    return dtoItemClass;
  })
  @ValidateNested({ each: true })
  items!: T[];
}
