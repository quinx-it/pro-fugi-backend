import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { ProductItemsModule } from '@/modules/products/submodules';
import { ProductFavouritesController } from '@/modules/products/submodules/favourites/product-favourites.controller';
import { ProductFavouritesService } from '@/modules/products/submodules/favourites/product-favourites.service';
import { ProductFavouritesRepository } from '@/modules/products/submodules/favourites/repositories';
import { RedisModule } from '@/modules/redis';

@Module({
  imports: [ProductItemsModule, AuthModule, RedisModule],
  providers: [ProductFavouritesRepository, ProductFavouritesService],
  controllers: [ProductFavouritesController],
})
export class ProductFavouritesModule {}
