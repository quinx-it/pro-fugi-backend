import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { NEWS_IMAGES_PATH } from '@/modules/news/constants';
import { NewsArticleEntity } from '@/modules/news/entities';
import { NewsController } from '@/modules/news/news.controller';
import { NewsService } from '@/modules/news/news.service';
import { NewsArticlesRepository } from '@/modules/news/repositories';
import { SERVE_STATIC_OPTIONS } from '@/shared';
import { MulterUtil } from '@/shared/utils/multer.util';

const { rootPath } = SERVE_STATIC_OPTIONS;

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsArticleEntity]),
    AuthModule,
    MulterUtil.getModule(rootPath, NEWS_IMAGES_PATH),
  ],
  providers: [NewsArticlesRepository, NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
