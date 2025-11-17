import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsString } from 'class-validator';

import { IsMarkdown } from '@/modules/news/dtos/validators';
import { INewsArticle } from '@/modules/news/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class NewsArticleDto implements INewsArticle {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsMarkdown()
  contentMarkdown!: string;

  @ApiProperty()
  @IsString()
  imageFileName!: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;

  @ApiProperty({ type: Date, nullable: true })
  @DtosUtil.isNullable()
  @IsDate()
  publishAt!: Date | null;
}
