import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CustomerRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-role.auth-guard';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthCustomerPayload } from '@/modules/auth/submodules/users/types';
import { ProductsEndPoint } from '@/modules/products/constants';
import { DestroyProductFavouritesDto } from '@/modules/products/submodules/favourites/dtos';
import { ProductFavouritesService } from '@/modules/products/submodules/favourites/product-favourites.service';
import { ProductItemDto } from '@/modules/products/submodules/items/dtos';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { IdentityDto } from '@/shared/dtos/identity.dto';

@Controller()
@ApiTags(ProductsEndPoint.FAVOURITES)
export class ProductFavouritesController {
  constructor(private readonly service: ProductFavouritesService) {}

  @ApiResponse({
    type: ProductItemDto,
    status: HttpStatus.OK,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Get(ProductsEndPoint.FAVOURITES)
  async findMany(
    @AuthPayload() authPayload: IAuthCustomerPayload,
  ): Promise<ProductItemDto[]> {
    const { authCustomerRoleId } = authPayload;

    const productItems = await this.service.findMany(authCustomerRoleId);

    return productItems.map((productItem) =>
      plainToInstance(ProductItemDto, productItem),
    );
  }

  @ApiResponse({
    type: ProductItemDto,
    status: HttpStatus.CREATED,
    isArray: true,
  })
  @ApiBody({ type: IdentityDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.FAVOURITES)
  async createMany(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Body() body: IdentityDto[],
  ): Promise<IProductItem[]> {
    const { authCustomerRoleId } = authPayload;

    const productItems = await this.service.createMany(
      authCustomerRoleId,
      body.map(({ id }) => id),
    );

    return productItems.map((productItem) =>
      plainToInstance(ProductItemDto, productItem),
    );
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.FAVOURITES)
  async destroyMany(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Query() query: DestroyProductFavouritesDto,
  ): Promise<void> {
    const { authCustomerRoleId } = authPayload;

    const { productItemIds } = query;

    await this.service.destroyMany(authCustomerRoleId, productItemIds);
  }
}
