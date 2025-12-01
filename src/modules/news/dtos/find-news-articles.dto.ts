import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

import { INewsArticle } from '@/modules/news/types';
import { IFilter, IPagination, ISort } from '@/shared';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class FindNewsArticlesDto
  implements IFilter<INewsArticle>, ISort<INewsArticle>, IPagination
{
  @ApiProperty({ name: 'title_contains', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'title_contains' })
  titleContains?: string;

  @ApiProperty({ name: 'description_contains', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'description_contains' })
  descriptionContains?: string;

  @ApiProperty({
    name: 'content_markdown_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'content_markdown_contains' })
  contentMarkdownContains?: string;

  @ApiProperty({
    name: 'tags_contain',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedStringArray)
  @Expose({ name: 'tags_contain' })
  tagsContain?: string[];

  @ApiProperty({
    name: 'tags_do_not_contain',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedStringArray)
  @Expose({ name: 'tags_do_not_contain' })
  tagsDoNotContain?: string[];

  // region Pagination

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

  // endregion

  // region Sorting

  @ApiProperty({ name: 'sort_by', required: false, type: String })
  @IsOptional()
  @IsString()
  @Expose({ name: 'sort_by' })
  sortBy: keyof INewsArticle = 'publishAt';

  @ApiProperty({ name: 'descending', required: false })
  @IsOptional()
  @Transform(({ value }) => value === JSON.stringify(true))
  @Expose({ name: 'descending' })
  @IsBoolean()
  descending: boolean = false;

  // endregion

  get filter(): IFilter<INewsArticle> {
    const {
      titleContains,
      descriptionContains,
      contentMarkdownContains,
      tagsContain,
      tagsDoNotContain,
    } = this;

    return {
      titleContains,
      descriptionContains,
      contentMarkdownContains,
      tagsContain,
      tagsDoNotContain,
    };
  }

  get sort(): ISort<INewsArticle> {
    const { sortBy, descending } = this;

    return { sortBy, descending };
  }

  get pagination(): IPagination {
    const { page, limit, offset } = this;

    return { page, limit, offset };
  }
}
