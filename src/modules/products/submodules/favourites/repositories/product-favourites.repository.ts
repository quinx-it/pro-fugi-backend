import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { PRODUCT_FAVOURITES_REDIS_KEY_TEMPLATE } from '@/modules/products/submodules/favourites/constants';
import { InjectRedis } from '@/shared/decorators';
import { RedisUtil } from '@/shared/utils/redis.util';

@Injectable()
export class ProductFavouritesRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async findMany(authCustomerRoleId: number): Promise<Set<number>> {
    const setName = ProductFavouritesRepository.getRedisKey(authCustomerRoleId);

    const productFavouritesIds = await RedisUtil.getFromSet<number>(
      this.redis,
      setName,
    );

    return productFavouritesIds;
  }

  async createMany(
    authCustomerRoleId: number,
    productFavouritesIds: Set<number> | Array<number>,
  ): Promise<Set<number>> {
    const setName = ProductFavouritesRepository.getRedisKey(authCustomerRoleId);

    const values = new Set(productFavouritesIds);

    await RedisUtil.addToSet(this.redis, setName, values);

    return values;
  }

  async destroyMany(
    authCustomerRoleId: number,
    productFavouritesIds?: Set<number> | Array<number>,
  ): Promise<number> {
    const setName = ProductFavouritesRepository.getRedisKey(authCustomerRoleId);

    const values = productFavouritesIds
      ? new Set(productFavouritesIds)
      : undefined;

    const affected = await RedisUtil.removeFromSet(this.redis, setName, values);

    return affected;
  }

  private static getRedisKey(authCustomerRoleId: number): string {
    return PRODUCT_FAVOURITES_REDIS_KEY_TEMPLATE.execute({
      authCustomerRoleId: authCustomerRoleId.toString(),
    });
  }
}
