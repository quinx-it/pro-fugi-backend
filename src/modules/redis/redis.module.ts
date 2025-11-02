import { Module } from '@nestjs/common';

import { RedisProvider } from '@/modules/redis/providers';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
