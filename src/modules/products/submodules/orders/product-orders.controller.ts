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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { CustomerRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/customers/guards/customer-role.auth-guard';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import {
  IAuthCustomerPayload,
  IAuthPayload,
} from '@/modules/auth/submodules/users/types';
import { ProductsEndPoint } from '@/modules/products/constants';
import { CreateProductItemDto } from '@/modules/products/submodules/items/dtos';
import {
  PRODUCT_ORDERS_CUSTOMER_QUERY_PAGINATION,
  PRODUCT_ORDERS_CUSTOMER_QUERY_SORT,
} from '@/modules/products/submodules/orders/constants';
import {
  CreateProductOrderAsAdminDto,
  CreateProductOrderDto,
  CreateProductOrderItemAsAdminDto,
  FindProductOrdersDto,
  ProductCustomerDiscountDto,
  ProductOrderDto,
  ProductOrderItemDto,
  UpdateProductOrderDto,
  UpdateProductOrderItemDto,
} from '@/modules/products/submodules/orders/dtos';
import { ProductOrdersService } from '@/modules/products/submodules/orders/product-orders.service';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

@Controller()
@ApiExtraModels(
  CreateProductOrderItemAsAdminDto,
  CreateProductOrderAsAdminDto,
  CreateProductItemDto,
  CreateProductOrderDto,
  FindProductOrdersDto,
)
@ApiTags(ProductsEndPoint.ORDERS)
export class ProductOrdersController {
  constructor(private readonly service: ProductOrdersService) {}

  // region Orders

  @ApiResponse({
    type: PaginatedDto.of(ProductOrderDto),
    status: HttpStatus.OK,
  })
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDERS)
  async findMany(
    @AuthPayload() authPayload: IAuthCustomerPayload,
    @Query() query: FindProductOrdersDto,
  ): Promise<PaginatedDto<ProductOrderDto>> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload || {
      authCustomerRoleId: null,
      authAdminRoleId: null,
    };

    if (authCustomerRoleId) {
      const queryParamsCount = Object.values(query).filter(
        (queryValue) => queryValue !== undefined,
      ).length;

      if (queryParamsCount) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_ORDERS_CUSTOMER_QUERY_MUST_NOT_PROVIDE_PARAMS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const productOrders = await this.service.findMany(
        { authCustomerRoleId },
        PRODUCT_ORDERS_CUSTOMER_QUERY_SORT,
        PRODUCT_ORDERS_CUSTOMER_QUERY_PAGINATION,
      );

      return plainToInstance(PaginatedDto.of(ProductOrderDto), productOrders);
    }

    if (authAdminRoleId) {
      const { pagination, filter, sort } = query;

      if (!pagination || !sort) {
        throw new AppException(
          ERROR_MESSAGES.PRODUCT_ORDERS_ADMIN_QUERY_MUST_PROVIDE_PARAMS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const productOrders = await this.service.findMany(
        filter,
        sort,
        pagination,
      );

      return plainToInstance(PaginatedDto.of(ProductOrderDto), productOrders);
    }

    throw new AppException(ERROR_MESSAGES.HTTP_INTERNAL_SERVER_ERROR);
  }

  @ApiResponse({
    type: ProductOrderDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDER)
  async findOne(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
  ): Promise<ProductOrderDto> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload;

    const productOrder = await this.service.findOne(
      authAdminRoleId ? undefined : authCustomerRoleId || undefined,
      productOrderId,
      true,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiResponse({
    type: ProductOrderDto,
    status: HttpStatus.CREATED,
  })
  @ApiBearerAuth()
  @DtosUtil.apiBody(CreateProductOrderDto, CreateProductOrderAsAdminDto)
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @Post(ProductsEndPoint.ORDERS)
  async createOne(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload,
    @DtosUtil.body(CreateProductOrderDto, CreateProductOrderAsAdminDto)
    body: CreateProductOrderDto | CreateProductOrderAsAdminDto,
  ): Promise<ProductOrderDto> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload || {
      authCustomerRoleId: null,
      authAdminRoleId: null,
    };

    if (body instanceof CreateProductOrderDto) {
      if (authAdminRoleId) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.AUTH_ROLE_FORBIDDEN_TEMPLATE,
          { authRole: AuthRole.ADMIN },
          HttpStatus.FORBIDDEN,
        );
      }

      const {
        productOrderItems,
        deliveryType,
        addressIfNotDefault,
        phoneIfNotDefault,
        comment,
      } = body;

      const productOrder = await this.service.createOne(
        authCustomerRoleId,
        productOrderItems,
        deliveryType,
        addressIfNotDefault,
        phoneIfNotDefault,
        comment,
      );

      return plainToInstance(ProductOrderDto, productOrder);
    }

    if (!authAdminRoleId) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
        { authRole: AuthRole.ADMIN },
        HttpStatus.FORBIDDEN,
      );
    }

    const {
      authCustomerRoleId: bodyAuthCustomerRoleId,
      productOrderItems,
      deliveryType,
      addressIfNotDefault,
      phoneIfNotDefault,
      comment,
    } = body;

    const productOrder = await this.service.createOne(
      bodyAuthCustomerRoleId,
      productOrderItems,
      deliveryType,
      addressIfNotDefault,
      phoneIfNotDefault,
      comment,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiResponse({
    type: ProductOrderDto,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(ProductsEndPoint.ORDER)
  async updateOne(
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Body() body: UpdateProductOrderDto,
  ): Promise<ProductOrderDto> {
    const {
      deliveryType,
      addressIfNotDefault,
      status,
      phone,
      manualPriceAdjustment,
    } = body;

    const productOrder = await this.service.updateOne(
      undefined,
      productOrderId,
      deliveryType,
      addressIfNotDefault,
      phone,
      status,
      manualPriceAdjustment,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  // endregion

  // region Order items

  @ApiResponse({
    type: ProductOrderItemDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDER_ITEM)
  async findOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
  ): Promise<ProductOrderItemDto> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload;

    const productOrderItem = await this.service.findOnesItem(
      authAdminRoleId ? undefined : authCustomerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      true,
    );

    return plainToInstance(ProductOrderItemDto, productOrderItem);
  }

  @ApiResponse({
    type: ProductOrderItemDto,
    status: HttpStatus.CREATED,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.ORDER_ITEMS)
  async createOnesItem(
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Body() body: CreateProductOrderItemAsAdminDto,
  ): Promise<ProductOrderItemDto> {
    const { count, productItem, pricePerProductItemIfNotDefault } = body;

    const productOrderItem = await this.service.createOnesItem(
      undefined,
      productOrderId,
      productItem.id,
      count,
      pricePerProductItemIfNotDefault,
    );

    return plainToInstance(ProductOrderItemDto, productOrderItem);
  }

  @ApiResponse({
    type: ProductOrderItemDto,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(ProductsEndPoint.ORDER_ITEM)
  async replaceOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
    @Body() body: CreateProductOrderItemAsAdminDto,
  ): Promise<ProductOrderDto> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload;

    const { count, productItem, pricePerProductItemIfNotDefault } = body;

    const productOrder = await this.service.updateOnesItem(
      authAdminRoleId ? undefined : authCustomerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      productItem.id,
      count,
      pricePerProductItemIfNotDefault,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiResponse({
    type: ProductOrderItemDto,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(ProductsEndPoint.ORDER_ITEM)
  async updateOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
    @Body() body: UpdateProductOrderItemDto,
  ): Promise<ProductOrderDto> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload;

    const { count, productItem, pricePerProductItemIfNotDefault } = body;

    const productOrder = await this.service.updateOnesItem(
      authAdminRoleId ? undefined : authCustomerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      productItem?.id,
      count,
      pricePerProductItemIfNotDefault,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.ORDER_ITEM)
  async destroyOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
  ): Promise<void> {
    const { authCustomerRoleId, authAdminRoleId } = authPayload;

    await this.service.destroyOnesItem(
      authAdminRoleId ? undefined : authCustomerRoleId || undefined,
      productOrderId,
      productOrderItemId,
    );
  }

  @ApiResponse({ type: ProductCustomerDiscountDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Get(ProductsEndPoint.ORDERS_DISCOUNT)
  async findOneDiscount(
    @AuthPayload() authPayload: IAuthCustomerPayload,
  ): Promise<ProductCustomerDiscountDto> {
    const { authCustomerRoleId } = authPayload;

    const discount = await this.service.findCustomerDiscount(
      authCustomerRoleId,
    );

    return plainToInstance(ProductCustomerDiscountDto, discount);
  }

  // endregion
}
