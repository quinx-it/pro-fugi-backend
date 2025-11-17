import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

import { IsMarkdown } from '@/modules/news/dtos/validators';
import { ICreateNewsArticle } from '@/modules/news/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

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
