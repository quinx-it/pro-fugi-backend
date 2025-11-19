import { Module } from '@nestjs/common';

import { redisConfig } from '@/configs';
import { AuthModule } from '@/modules/auth/auth.module';
import { ProductItemsModule } from '@/modules/products/submodules';
import { ProductFavouritesController } from '@/modules/products/submodules/favourites/product-favourites.controller';
import { ProductFavouritesService } from '@/modules/products/submodules/favourites/product-favourites.service';
import { ProductFavouritesRepository } from '@/modules/products/submodules/favourites/repositories';
import { RedisUtil } from '@/shared/utils/redis.util';

@Module({
  imports: [ProductItemsModule, AuthModule, RedisUtil.getModule(redisConfig)],
  providers: [ProductFavouritesRepository, ProductFavouritesService],
  controllers: [ProductFavouritesController],
})
export class ProductFavouritesModule {}
