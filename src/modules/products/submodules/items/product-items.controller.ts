import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { ProductsEndPoint } from '@/modules/products/constants';
import { PRODUCT_ITEMS_IMAGES_PATH } from '@/modules/products/submodules/items/constants';
import { CreateProductItemDto } from '@/modules/products/submodules/items/dtos';
import { FindProductItemsDto } from '@/modules/products/submodules/items/dtos/find-product-items.dto';
import { PaginatedProductItemsDto } from '@/modules/products/submodules/items/dtos/paginated-product-items.dto';
import { ProductItemDto } from '@/modules/products/submodules/items/dtos/product-item.dto';
import { ProductItemsService } from '@/modules/products/submodules/items/product-items.service';
import { FileDto } from '@/shared/dtos/file.dto';

@Controller()
@ApiTags(ProductsEndPoint.ITEMS)
export class ProductItemsController {
  constructor(private readonly service: ProductItemsService) {}

  @ApiResponse({ type: ProductItemDto, status: HttpStatus.OK })
  @Get(ProductsEndPoint.ITEM)
  async findOne(
    @Param('product_item_id', ParseIntPipe) productItemId: number,
  ): Promise<ProductItemDto> {
    const product = await this.service.findOne(productItemId, true);

    return plainToInstance(ProductItemDto, product);
  }

  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @ApiResponse({ type: PaginatedProductItemsDto, status: HttpStatus.OK })
  @Get(ProductsEndPoint.ITEMS)
  async findMany(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload | null,
    @Query()
    query: FindProductItemsDto,
  ): Promise<PaginatedProductItemsDto> {
    const { roles } = authPayload || { roles: [] as AuthRole[] };

    const isArchived = roles.includes(AuthRole.ADMIN) ? false : undefined;

    const { specification, filter, sort, pagination } = query;

    const products = await this.service.findMany(
      { ...filter, isArchived },
      specification || [],
      sort,
      pagination,
    );

    return plainToInstance(PaginatedProductItemsDto, products);
  }

  @ApiResponse({ type: ProductItemDto, status: HttpStatus.CREATED })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Post(ProductsEndPoint.ITEMS)
  async createOne(@Body() body: CreateProductItemDto): Promise<ProductItemDto> {
    const {
      name,
      price,
      description,
      specification,
      productCategory,
      productImages,
    } = body;

    const product = await this.service.createOne(
      name,
      description,
      specification,
      productCategory.id,
      productImages,
      price,
    );

    return plainToInstance(ProductItemDto, product);
  }

  @ApiResponse({ type: ProductItemDto, status: HttpStatus.OK })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Put(ProductsEndPoint.ITEM)
  async replaceOne(
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Body() body: CreateProductItemDto,
  ): Promise<ProductItemDto> {
    const {
      name,
      price,
      description,
      specification,
      productCategory,
      productImages,
    } = body;

    const product = await this.service.updateOne(
      productItemId,
      name,
      description,
      specification,
      productCategory.id,
      productImages,
      price,
    );

    return plainToInstance(ProductItemDto, product);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: FileDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @Post(ProductsEndPoint.ITEMS_IMAGES)
  @UseInterceptors(FileInterceptor('file'))
  async createOneImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    return FileDto.fromDir(PRODUCT_ITEMS_IMAGES_PATH, file.filename);
  }
}
