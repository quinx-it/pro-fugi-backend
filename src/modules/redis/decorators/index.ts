import { Inject } from '@nestjs/common';

import { REDIS_PROVIDER_NAME } from '@/modules/redis/constants';

export const InjectRedis = (): PropertyDecorator & ParameterDecorator =>
  Inject(REDIS_PROVIDER_NAME);
