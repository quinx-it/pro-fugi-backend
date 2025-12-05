import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

import { NEWS_IMAGES_PATH } from '@/modules/news/constants';
import { IsMarkdown } from '@/modules/news/dtos/validators';
import { IUpdateNewsArticle } from '@/modules/news/types';
import { DtosUtil } from '@/shared/utils/dtos.util';
import { IsFileLocated } from '@/shared/validators/is-located';

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
  @IsFileLocated(NEWS_IMAGES_PATH)
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
