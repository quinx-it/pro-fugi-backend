import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductReviewEntity } from '@/modules/products/submodules/reviews/entities';
import { ProductReviewImageEntity } from '@/modules/products/submodules/reviews/entities/product-review-image.entity';
import { ProductReviewsController } from '@/modules/products/submodules/reviews/product-reviews.controller';
import { ProductReviewsService } from '@/modules/products/submodules/reviews/product-reviews.service';
import { ProductReviewsImagesRepository } from '@/modules/products/submodules/reviews/repositories';
import { ProductReviewsRepository } from '@/modules/products/submodules/reviews/repositories/product-reviews.repository';
import { SERVE_STATIC_OPTIONS } from '@/shared';
import { MulterUtil } from '@/shared/utils/multer.util';

const { rootPath } = SERVE_STATIC_OPTIONS;

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProductReviewEntity, ProductReviewImageEntity]),
    MulterUtil.getModule(rootPath, 'images/products/reviews'),
  ],
  providers: [
    ProductReviewsService,
    ProductReviewsRepository,
    ProductReviewsImagesRepository,
  ],
  controllers: [ProductReviewsController],
})
export class ProductReviewsModule {}
