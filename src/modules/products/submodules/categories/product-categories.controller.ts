import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { ProductsEndPoint } from '@/modules/products/constants';
import {
  CreateProductCategoryDto,
  ProductCategoriesPaginatedDto,
  ProductCategoryDto,
  ReplaceProductCategoryDto,
} from '@/modules/products/submodules/categories/dtos';
import { ProductCategoriesService } from '@/modules/products/submodules/categories/product-categories.service';
import { PaginationDto } from '@/shared/dtos/pagination.dto';

@Controller()
@ApiTags(ProductsEndPoint.CATEGORIES)
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCategoriesPaginatedDto,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @Get(ProductsEndPoint.CATEGORIES)
  async findMany(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload | null,
    @Query() query: PaginationDto,
  ): Promise<ProductCategoriesPaginatedDto> {
    const { authRoles } = authPayload || { authRoles: [] as AuthRole[] };

    const isArchived = authRoles.includes(AuthRole.ADMIN) ? false : undefined;

    const productCategories = await this.service.findMany(query, isArchived);

    return plainToInstance(ProductCategoriesPaginatedDto, productCategories);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCategoryDto,
  })
  @Get(ProductsEndPoint.CATEGORY)
  async findOne(
    @Param('product_category_id', ParseIntPipe) productCategoryId: number,
  ): Promise<ProductCategoryDto> {
    const productCategory = await this.service.findOne(productCategoryId, true);

    return plainToInstance(ProductCategoryDto, productCategory);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductCategoryDto,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.CATEGORIES)
  async createOne(
    @Body() body: CreateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const { name, specificationSchema } = body;

    const productCategory = await this.service.createOne(
      name,
      specificationSchema,
    );

    return plainToInstance(ProductCategoryDto, productCategory);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCategoryDto,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(ProductsEndPoint.CATEGORY)
  async replaceOne(
    @Param('product_category_id', ParseIntPipe) productCategoryId: number,
    @Body() body: ReplaceProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const { name, isArchived, specificationSchema } = body;

    const productCategory = await this.service.updateOne(
      productCategoryId,
      name,
      specificationSchema,
      isArchived,
    );

    return plainToInstance(ProductCategoryDto, productCategory);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.CATEGORY)
  async destroyOne(
    @Param('product_category_id', ParseIntPipe) productCategoryId: number,
  ): Promise<void> {
    await this.service.destroyOne(productCategoryId);
  }
}
