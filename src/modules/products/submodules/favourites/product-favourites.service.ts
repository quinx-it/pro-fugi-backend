import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { productsConfig } from '@/configs/products.config';
import { ProductFavouritesRepository } from '@/modules/products/submodules/favourites/repositories';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class ProductFavouritesService {
  private readonly limit: number;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: ProductFavouritesRepository,
    private readonly productItemsService: ProductItemsService,
  ) {
    const { favouritesLimit } = productsConfig;

    this.limit = favouritesLimit;
  }

  async findMany(authCustomerRoleId: number): Promise<IProductItem[]> {
    const productItemIds = await this.repo.findMany(authCustomerRoleId);

    const productItems = await this.productItemsService.findMany(
      Array.from(productItemIds),
    );

    return productItems;
  }

  async createMany(
    authCustomerRoleId: number,
    productItemIds: number[],
  ): Promise<IProductItem[]> {
    const productItemIdsExisting = await this.repo.findMany(authCustomerRoleId);

    const { size } = new Set([...productItemIdsExisting, ...productItemIds]);

    const { limit } = this;

    if (size > limit) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.PRODUCT_FAVOURITES_CANNOT_HAVE_MORE_THAN_TEMPLATE,
        { limit: limit.toString() },
        HttpStatus.BAD_REQUEST,
      );
    }

    const productItemIdsInserted = await this.repo.createMany(
      authCustomerRoleId,
      productItemIds,
    );

    const productItems = await this.productItemsService.findMany(
      Array.from(productItemIdsInserted),
    );

    return productItems;
  }

  async destroyMany(
    authCustomerRoleId: number,
    productItemIds?: number[],
  ): Promise<void> {
    await this.repo.destroyMany(authCustomerRoleId, productItemIds);
  }
}
