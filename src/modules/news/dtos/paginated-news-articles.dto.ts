import { ClassConstructor } from 'class-transformer';

import { NewsArticleDto } from '@/modules/news/dtos/news-article.dto';
import { INewsArticle } from '@/modules/news/types';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PaginatedNewsArticlesDto extends PaginatedDto<INewsArticle> {
  get dtoItemClass(): ClassConstructor<INewsArticle> {
    return NewsArticleDto;
  }
}
