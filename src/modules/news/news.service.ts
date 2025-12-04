import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { NewsArticlesRepository } from '@/modules/news/repositories';
import { INewsArticle } from '@/modules/news/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class NewsService {
  constructor(
    private readonly repo: NewsArticlesRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findManyPaginated(
    filter: IFilter<INewsArticle>,
    allowUnpublished: boolean,
    sort: ISort<INewsArticle>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
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
      manager,
    );

    return PaginationUtil.fromSinglePage(items, count, pagination);
  }

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound?: true,
    manager?: EntityManager,
  ): Promise<INewsArticle>;

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound?: false,
    manager?: EntityManager,
  ): Promise<INewsArticle | null>;

  async findOne(
    id: number,
    allowUnpublished?: boolean,
    throwIfNotFound: boolean = true,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<INewsArticle | null> {
    const newsArticle = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

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
    manager: EntityManager | null = null,
  ): Promise<INewsArticle> {
    return DbUtil.transaction(
      async (transactionManager) =>
        this.repo.createOne(
          title,
          description,
          contentMarkdown,
          imageFileName,
          tags,
          publishAt,
          transactionManager,
        ),
      this.dataSource,
      manager,
    );
  }

  async updateOne(
    id: number,
    title?: string,
    description?: string,
    contentMarkdown?: string,
    imageFileName?: string,
    tags?: string[],
    publishAt?: Date | null,
    manager: EntityManager | null = null,
  ): Promise<INewsArticle> {
    return DbUtil.transaction(
      async (transactionManager) =>
        this.repo.updateOne(
          id,
          title,
          description,
          contentMarkdown,
          imageFileName,
          tags,
          publishAt,
          transactionManager,
        ),
      this.dataSource,
      manager,
    );
  }

  async destroyOne(
    id: number,
    manager: EntityManager | null = null,
  ): Promise<void> {
    return DbUtil.transaction(
      async (transactionManager) =>
        this.repo.destroyOne(id, transactionManager),
      this.dataSource,
      manager,
    );
  }
}
