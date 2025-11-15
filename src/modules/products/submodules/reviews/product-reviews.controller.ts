import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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

import { CustomerRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-role.auth-guard';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthCustomerPayload } from '@/modules/auth/submodules/users/types';
import { ProductsEndPoint } from '@/modules/products/constants';
import { PRODUCT_REVIEW_IMAGES_PATH } from '@/modules/products/submodules/reviews/constants';
import {
  CreateProductReviewDto,
  PaginatedProductReviewsDto,
  ProductReviewDto,
  UpdateProductReviewDto,
} from '@/modules/products/submodules/reviews/dtos';
import { ProductReviewsService } from '@/modules/products/submodules/reviews/product-reviews.service';
import { FileDto } from '@/shared/dtos/file.dto';
import { PaginationDto } from '@/shared/dtos/pagination.dto';

@Controller()
@ApiTags(ProductsEndPoint.REVIEWS)
export class ProductReviewsController {
  constructor(private readonly service: ProductReviewsService) {}

  @ApiResponse({ status: HttpStatus.OK, type: PaginatedProductReviewsDto })
  @Get(ProductsEndPoint.REVIEWS)
  async findMany(
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Query() query: PaginationDto,
  ): Promise<PaginatedProductReviewsDto> {
    const productReviews = await this.service.findMany(productItemId, query);

    return plainToInstance(PaginatedProductReviewsDto, productReviews);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductReviewDto })
  @Get(ProductsEndPoint.REVIEW)
  async findOne(
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Param('product_review_id', ParseIntPipe) productReviewId: number,
  ): Promise<ProductReviewDto> {
    const productReview = await this.service.findOne(
      productItemId,
      productReviewId,
      true,
    );

    return plainToInstance(ProductReviewDto, productReview);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: ProductReviewDto })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.REVIEWS)
  async createOne(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Body() body: CreateProductReviewDto,
  ): Promise<ProductReviewDto> {
    const { authCustomerRoleId } = authPayload;

    const { text, rating, productReviewImages } = body;

    const productReview = await this.service.createOne(
      authCustomerRoleId,
      productItemId,
      rating,
      text,
      productReviewImages,
    );

    return plainToInstance(ProductReviewDto, productReview);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductReviewDto })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(ProductsEndPoint.REVIEW)
  async replaceOne(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Param('product_review_id', ParseIntPipe) productReviewId: number,
    @Body() body: CreateProductReviewDto,
  ): Promise<ProductReviewDto> {
    const { authCustomerRoleId } = authPayload;

    const { text, rating, productReviewImages } = body;

    const productReview = await this.service.updateOne(
      authCustomerRoleId,
      productItemId,
      productReviewId,
      rating,
      text,
      productReviewImages,
    );

    return plainToInstance(ProductReviewDto, productReview);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductReviewDto })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(ProductsEndPoint.REVIEW)
  async updateOne(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Param('product_review_id', ParseIntPipe) productReviewId: number,
    @Body() body: UpdateProductReviewDto,
  ): Promise<ProductReviewDto> {
    const { authCustomerRoleId } = authPayload;

    const { text, rating } = body;

    const productReview = await this.service.updateOne(
      authCustomerRoleId,
      productItemId,
      productReviewId,
      rating,
      text,
    );

    return plainToInstance(ProductReviewDto, productReview);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.REVIEW)
  async destroyOne(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Param('product_item_id', ParseIntPipe) productItemId: number,
    @Param('product_review_id', ParseIntPipe) productReviewId: number,
  ): Promise<void> {
    const { authCustomerRoleId } = authPayload;

    await this.service.destroyOne(
      authCustomerRoleId,
      productItemId,
      productReviewId,
    );
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
  @Post(ProductsEndPoint.REVIEWS_IMAGES)
  @UseInterceptors(FileInterceptor('file'))
  async createOneImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    return FileDto.fromDir(PRODUCT_REVIEW_IMAGES_PATH, file.filename);
  }
}
