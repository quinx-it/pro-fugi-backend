import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

import { NEWS_IMAGES_PATH } from '@/modules/news/constants';
import { IsMarkdown } from '@/modules/news/dtos/validators';
import { ICreateNewsArticle } from '@/modules/news/types';
import { DtosUtil } from '@/shared/utils/dtos.util';
import { IsFileLocated } from '@/shared/validators/is-located';

export class CreateNewsArticleDto implements ICreateNewsArticle {
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
  @IsFileLocated(NEWS_IMAGES_PATH)
  imageFileName!: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({ type: Date, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => Date)
  @IsDate()
  publishAt!: Date | null;
}
