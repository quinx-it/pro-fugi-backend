import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

import { REDIS_PROVIDER_NAME } from '@/shared/constants/redis.constants';

export const InjectCacheManager = (): PropertyDecorator & ParameterDecorator =>
  Inject(CACHE_MANAGER);

export const InjectRedis = (): PropertyDecorator & ParameterDecorator =>
  Inject(REDIS_PROVIDER_NAME);
