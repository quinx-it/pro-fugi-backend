import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { NewsArticleEntity } from '@/modules/news/entities';
import { INewsArticle } from '@/modules/news/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IFilter,
  IPagination,
  ISort,
} from '@/shared';

@Injectable()
export class NewsArticlesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findManyAndCount(
    filter: IFilter<INewsArticle>,
    sort: ISort<INewsArticle>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<{ items: INewsArticle[]; count: number }> {
    const where = DbUtil.filterToFindOptionsWhere(filter);
    const order = DbUtil.sortToFindOptionsOrder(sort);
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const [items, count] = await manager.findAndCount(NewsArticleEntity, {
      where,
      order,
      take,
      skip,
    });

    return { items, count };
  }

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<INewsArticle>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<INewsArticle | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<INewsArticle | null> {
    const newsArticle = await manager.findOne(NewsArticleEntity, {
      where: { id },
    });

    if (!newsArticle) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'News article',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
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
    manager: EntityManager = this.dataSource.manager,
  ): Promise<INewsArticle> {
    const newsArticle = await manager.save(NewsArticleEntity, {
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    });

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
    manager: EntityManager = this.dataSource.manager,
  ): Promise<INewsArticle> {
    if (
      title !== undefined ||
      description !== undefined ||
      contentMarkdown !== undefined ||
      imageFileName !== undefined ||
      tags !== undefined ||
      publishAt !== undefined
    ) {
      await manager.update(NewsArticleEntity, id, {
        title,
        description,
        contentMarkdown,
        imageFileName,
        tags,
        publishAt,
      });
    }

    const newsArticle = await this.findOne(id, true, manager);

    return newsArticle;
  }

  async destroyOne(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(NewsArticleEntity, id);
  }
}
