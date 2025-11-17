import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { bullConfig, cacheConfig } from '@/configs';
import { typeOrmConfig } from '@/configs/db.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { NewsModule } from '@/modules/news/news.module';
import { ProductsModule } from '@/modules/products';
import { RedisModule } from '@/modules/redis/redis.module';
import { SERVE_STATIC_OPTIONS, UniversalExceptionFilter } from '@/shared';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    NewsModule,

    RedisModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot(SERVE_STATIC_OPTIONS),
    BullModule.forRoot(bullConfig),
    CacheModule.register(cacheConfig),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UniversalExceptionFilter,
    },
  ],
})
export class AppModule {}
