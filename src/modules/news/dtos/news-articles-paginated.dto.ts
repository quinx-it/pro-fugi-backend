import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { NewsArticleDto } from '@/modules/news/dtos/news-article.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class NewsArticlesPaginatedDto extends PaginatedDto<NewsArticleDto> {
  @ApiProperty({ type: NewsArticleDto, isArray: true })
  @IsArray()
  @Type(() => NewsArticleDto)
  @ValidateNested({ each: true })
  items!: NewsArticleDto[];
}
