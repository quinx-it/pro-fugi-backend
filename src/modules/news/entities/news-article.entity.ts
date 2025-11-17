import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { INewsArticle } from '@/modules/news/types';
import { DbType } from '@/shared';

@Entity()
export class NewsArticleEntity implements INewsArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(DbType.VARCHAR)
  title!: string;

  @Column(DbType.VARCHAR)
  description!: string;

  @Column(DbType.VARCHAR)
  imageFileName!: string;

  @Column(DbType.VARCHAR)
  contentMarkdown!: string;

  @Column(DbType.VARCHAR, { array: true })
  tags!: string[];

  @CreateDateColumn({ type: DbType.TIMESTAMP_TZ })
  createdAt!: Date;

  @UpdateDateColumn({ type: DbType.TIMESTAMP_TZ })
  updatedAt!: Date;

  @Column(DbType.TIMESTAMP_TZ, { nullable: true })
  publishAt!: Date | null;
}
