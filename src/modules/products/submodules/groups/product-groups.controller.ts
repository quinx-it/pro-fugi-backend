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

import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { ProductsEndPoint } from '@/modules/products/constants';
import {
  CreateProductGroupDto,
  ProductGroupDto,
  ProductGroupsPaginatedDto,
  ReplaceProductGroupDto,
} from '@/modules/products/submodules/groups/dtos';
import { ProductGroupsService } from '@/modules/products/submodules/groups/product-groups.service';
import { PaginationDto } from '@/shared/dtos/pagination.dto';

@Controller()
@ApiTags(ProductsEndPoint.GROUPS)
class ProductGroupsController {
  constructor(private readonly service: ProductGroupsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductGroupsPaginatedDto,
  })
  @Get(ProductsEndPoint.GROUPS)
  async findMany(
    @Query() query: PaginationDto,
  ): Promise<ProductGroupsPaginatedDto> {
    const productGroups = await this.service.findMany(query);

    return plainToInstance(ProductGroupsPaginatedDto, productGroups);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductGroupDto,
  })
  @Get(ProductsEndPoint.GROUP)
  async findOne(
    @Param('product_group_id', ParseIntPipe) productGroupId: number,
  ): Promise<ProductGroupDto> {
    const productGroup = await this.service.findOne(productGroupId, true);

    return plainToInstance(ProductGroupDto, productGroup);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductGroupDto,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.GROUPS)
  async createOne(
    @Body() body: CreateProductGroupDto,
  ): Promise<ProductGroupDto> {
    const {
      name,
      description,
      imageFileName,
      productCategory: { id: productCategoryId },
    } = body;

    const productGroup = await this.service.createOne(
      name,
      description,
      imageFileName,
      productCategoryId,
    );

    return plainToInstance(ProductGroupDto, productGroup);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductGroupDto,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(ProductsEndPoint.CATEGORY)
  async replaceOne(
    @Param('product_group_id', ParseIntPipe) productGroupId: number,
    @Body() body: ReplaceProductGroupDto,
  ): Promise<ProductGroupDto> {
    const { name, description, imageFileName } = body;

    const productGroup = await this.service.updateOne(
      productGroupId,
      name,
      description,
      imageFileName,
    );

    return plainToInstance(ProductGroupDto, productGroup);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.CATEGORY)
  async destroyOne(
    @Param('product_group_id', ParseIntPipe) productGroupId: number,
  ): Promise<void> {
    await this.service.destroyOne(productGroupId);
  }
}

export default ProductGroupsController;
