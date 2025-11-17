import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

import { IsMarkdown } from '@/modules/news/dtos/validators';
import { IUpdateNewsArticle } from '@/modules/news/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateNewsArticleDto implements IUpdateNewsArticle {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsMarkdown()
  contentMarkdown?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageFileName?: string;

  @ApiProperty({ type: 'string', isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsDate()
  publishAt?: Date | null;
}
