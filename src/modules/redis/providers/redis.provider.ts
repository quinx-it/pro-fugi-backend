import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

import { redisConfig } from '@/configs';
import { REDIS_PROVIDER_NAME } from '@/modules/redis/constants';

export const RedisProvider: Provider<Redis> = {
  provide: REDIS_PROVIDER_NAME,
  useFactory: () => {
    return new Redis(redisConfig);
  },
};
