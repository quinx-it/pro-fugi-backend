/* eslint-disable max-classes-per-file */
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import { IPaginated } from '@/shared';

export abstract class PaginatedDto<T> implements IPaginated<T> {
  abstract get dtoItemClass(): Type<T>;

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
  items!: T[];

  static of<TModel extends Type<unknown>>(
    model: TModel,
  ): Type<PaginatedDto<InstanceType<TModel>>> {
    class PaginatedDtoInheritor extends PaginatedDto<InstanceType<TModel>> {
      get dtoItemClass(): Type {
        return model;
      }

      @ApiProperty({ type: model, isArray: true })
      override items!: InstanceType<TModel>[];
    }

    return PaginatedDtoInheritor;
  }
}
