import { HttpStatus, Injectable } from '@nestjs/common';

import { NewsArticlesRepository } from '@/modules/news/repositories';
import { INewsArticle } from '@/modules/news/types';
import {
  AppException,
  ERROR_MESSAGES,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class NewsService {
  constructor(private readonly repo: NewsArticlesRepository) {}

  async findManyPaginated(
    filter: IFilter<INewsArticle>,
    allowUnpublished: boolean,
    sort: ISort<INewsArticle>,
    pagination: IPagination,
  ): Promise<IPaginated<INewsArticle>> {
    let publishAtMax = new Date();

    const filterPublishAtMax = filter.publishAtMax as Date | undefined;

    if (
      filterPublishAtMax !== undefined &&
      filterPublishAtMax.getTime() < publishAtMax.getTime()
    ) {
      publishAtMax = filterPublishAtMax;
    }

    const { items, count } = await this.repo.findManyAndCount(
      allowUnpublished ? filter : { ...filter, publishAtMax },
      sort,
      pagination,
    );

    return PaginationUtil.fromSinglePage(items, count, pagination);
  }

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound?: true,
  ): Promise<INewsArticle>;

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound?: false,
  ): Promise<INewsArticle | null>;

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound: boolean = true,
  ): Promise<INewsArticle | null> {
    const newsArticle = throwIfNotFound
      ? await this.repo.findOne(id, true)
      : await this.repo.findOne(id, false);

    if (newsArticle) {
      const { publishAt } = newsArticle;

      const isPublished =
        publishAt !== null
          ? publishAt.getTime() <= new Date().getTime()
          : false;

      if (!allowUnpublished && !isPublished) {
        if (throwIfNotFound) {
          throw new AppException(
            ERROR_MESSAGES.NEWS_ARTICLE_NOT_PUBLISHED,
            HttpStatus.FORBIDDEN,
          );
        }

        return null;
      }
    }

    return newsArticle;
  }

  async createOne(
    title: string,
    description: string,
    contentMarkdown: string,
    imageFileName: string,
    tags: string[],
    publishAt: Date | null,
  ): Promise<INewsArticle> {
    const newsArticle = await this.repo.createOne(
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    );

    return newsArticle;
  }

  async updateOne(
    id: number,
    title?: string,
    description?: string,
    contentMarkdown?: string,
    imageFileName?: string,
    tags?: string[],
    publishAt?: Date | null,
  ): Promise<INewsArticle> {
    const newsArticle = await this.repo.updateOne(
      id,
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    );

    return newsArticle;
  }

  async destroyOne(id: number): Promise<void> {
    await this.repo.destroyOne(id);
  }
}
