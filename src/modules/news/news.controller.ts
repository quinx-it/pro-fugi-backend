import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { NEWS_IMAGES_PATH, NewsEndPoint } from '@/modules/news/constants';
import {
  CreateNewsArticleDto,
  FindNewsArticlesDto,
  NewsArticleDto,
  NewsArticlesPaginatedDto,
  UpdateNewsArticleDto,
} from '@/modules/news/dtos';
import { NewsService } from '@/modules/news/news.service';
import { FileDto } from '@/shared/dtos/file.dto';

@Controller()
@ApiTags(NewsEndPoint.API_TAG)
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @ApiResponse({
    type: NewsArticlesPaginatedDto,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @Get(NewsEndPoint.ARTICLES)
  async findMany(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload | null,
    @Query() query: FindNewsArticlesDto,
  ): Promise<NewsArticlesPaginatedDto> {
    const { filter, pagination, sort } = query;

    const { authAdminRoleId } = authPayload || { authAdminRoleId: null };

    const articles = await this.service.findManyPaginated(
      filter,
      authAdminRoleId !== null,
      sort,
      pagination,
    );

    return plainToInstance(NewsArticlesPaginatedDto, articles);
  }

  @ApiResponse({ type: NewsArticleDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @Get(NewsEndPoint.ARTICLE)
  async findOne(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload | null,
    @Param('news_article_id', ParseIntPipe) newsArticleId: number,
  ): Promise<NewsArticleDto> {
    const { authAdminRoleId } = authPayload || { authAdminRoleId: null };

    const article = await this.service.findOne(
      newsArticleId,
      authAdminRoleId !== null,
      true,
    );

    return plainToInstance(NewsArticleDto, article);
  }

  @ApiResponse({ type: NewsArticleDto, status: HttpStatus.CREATED })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(NewsEndPoint.ARTICLES)
  async createOne(@Body() body: CreateNewsArticleDto): Promise<NewsArticleDto> {
    const {
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    } = body;

    const newsArticle = await this.service.createOne(
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    );

    return plainToInstance(NewsArticleDto, newsArticle);
  }

  @ApiResponse({ type: NewsArticleDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(NewsEndPoint.ARTICLE)
  async replaceOne(
    @Param('news_article_id', ParseIntPipe) newsArticleId: number,
    @Body() body: CreateNewsArticleDto,
  ): Promise<NewsArticleDto> {
    const {
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    } = body;

    const newsArticle = await this.service.updateOne(
      newsArticleId,
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    );

    return plainToInstance(NewsArticleDto, newsArticle);
  }

  @ApiResponse({ type: NewsArticleDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(NewsEndPoint.ARTICLE)
  async updateOne(
    @Param('news_article_id', ParseIntPipe) newsArticleId: number,
    @Body() body: UpdateNewsArticleDto,
  ): Promise<NewsArticleDto> {
    const {
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    } = body;

    const newsArticle = await this.service.updateOne(
      newsArticleId,
      title,
      description,
      contentMarkdown,
      imageFileName,
      tags,
      publishAt,
    );

    return plainToInstance(NewsArticleDto, newsArticle);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(NewsEndPoint.ARTICLE)
  async destroyOne(
    @Param('news_article_id', ParseIntPipe) newsArticleId: number,
  ): Promise<void> {
    await this.service.destroyOne(newsArticleId);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: FileDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @Post(NewsEndPoint.IMAGES)
  @UseInterceptors(FileInterceptor('file'))
  async createOneImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    return FileDto.fromDir(NEWS_IMAGES_PATH, file.filename);
  }
}
