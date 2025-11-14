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
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

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
  CreateProductOrderAsAdminDto,
  CreateProductOrderDto,
  CreateProductOrderItemAsAdminDto,
  CreateProductOrderItemDto,
  FindProductOrdersAsAdminDto,
  PaginatedProductOrdersDto,
  ProductOrderDto,
  UpdateProductOrderDto,
  UpdateProductOrderItemDto,
} from '@/modules/products/submodules/orders/dtos';
import { ProductOrdersService } from '@/modules/products/submodules/orders/product-orders.service';
import { AppException, ERROR_MESSAGES } from '@/shared';
import { DtosUtil } from '@/shared/utils/dtos.util';

@Controller()
@ApiExtraModels(
  CreateProductOrderItemAsAdminDto,
  CreateProductOrderAsAdminDto,
  CreateProductItemDto,
  CreateProductOrderDto,
  FindProductOrdersAsAdminDto,
)
@ApiTags(ProductsEndPoint.ORDERS)
export class ProductOrdersController {
  constructor(private readonly service: ProductOrdersService) {}

  // region Orders

  @UseGuards(CustomerRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDERS_CUSTOMER)
  async findManyAsCustomer(
    @AuthPayload() authPayload: IAuthCustomerPayload,
  ): Promise<ProductOrderDto[]> {
    const { customerRoleId } = authPayload;

    const { items: productOrders } = await this.service.findMany(
      { authCustomerRoleId: customerRoleId },
      { sortBy: 'createdAt', descending: true },
      { page: 0, limit: 5, offset: 0 },
    );

    return productOrders.map((productOrder) =>
      plainToInstance(ProductOrderDto, productOrder),
    );
  }

  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDERS_ADMIN)
  async findManyAsAdmin(
    @Query() query: FindProductOrdersAsAdminDto,
  ): Promise<PaginatedProductOrdersDto> {
    const { filter, sort, pagination } = query;

    const productOrders = await this.service.findMany(filter, sort, pagination);

    return plainToInstance(PaginatedProductOrdersDto, productOrders);
  }

  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDER)
  async findOne(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
  ): Promise<ProductOrderDto> {
    const { customerRoleId, adminRoleId } = authPayload;

    const productOrder = await this.service.findOne(
      adminRoleId ? undefined : customerRoleId || undefined,
      productOrderId,
      true,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiBearerAuth()
  @DtosUtil.apiBody(CreateProductOrderDto, CreateProductOrderAsAdminDto)
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @Post(ProductsEndPoint.ORDERS)
  async createOne(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload | null,
    @DtosUtil.body(CreateProductOrderDto, CreateProductOrderAsAdminDto)
    body: CreateProductOrderDto | CreateProductOrderAsAdminDto,
  ): Promise<ProductOrderDto> {
    const { customerRoleId, adminRoleId } = authPayload || {
      customerRoleId: null,
      adminRoleId: null,
    };

    const {
      authCustomerRoleId,
      productOrderItems,
      deliveryType,
      address,
      phone,
      comment,
    } = body;

    if (body instanceof CreateProductOrderAsAdminDto) {
      if (!adminRoleId) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.AUTH_ROLE_REQUIRED_TEMPLATE,
          { role: 'admin' },
          HttpStatus.FORBIDDEN,
        );
      }

      const productOrder = await this.service.createOne(
        authCustomerRoleId,
        productOrderItems,
        deliveryType,
        address,
        phone,
        comment,
      );

      return plainToInstance(ProductOrderDto, productOrder);
    }

    const productOrder = await this.service.createOne(
      customerRoleId,
      productOrderItems,
      deliveryType,
      address,
      phone,
      comment,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(ProductsEndPoint.ORDER)
  async updateOne(
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Body() body: UpdateProductOrderDto,
  ): Promise<ProductOrderDto> {
    const { deliveryType, address, status, phone, correctionPrice } = body;

    const productOrder = await this.service.updateOne(
      undefined,
      productOrderId,
      deliveryType,
      address,
      phone,
      status,
      correctionPrice,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  // endregion

  // region Order items

  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(ProductsEndPoint.ORDER_ITEM)
  async findOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
  ): Promise<ProductOrderDto> {
    const { customerRoleId, adminRoleId } = authPayload;

    const productOrder = await this.service.findOnesItem(
      adminRoleId ? undefined : customerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      true,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Post(ProductsEndPoint.ORDER_ITEMS)
  async createOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Body() body: CreateProductOrderItemDto,
  ): Promise<ProductOrderDto> {
    const { count, productItem, customPricePerProductItem } = body;

    const productOrder = await this.service.createOnesItem(
      undefined,
      productOrderId,
      productItem.id,
      count,
      customPricePerProductItem,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Put(ProductsEndPoint.ORDER_ITEM)
  async replaceOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
    @Body() body: CreateProductOrderItemDto,
  ): Promise<ProductOrderDto> {
    const { customerRoleId, adminRoleId } = authPayload;

    const { count, productItem, customPricePerProductItem } = body;

    const productOrder = await this.service.updateOnesItem(
      adminRoleId ? undefined : customerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      productItem.id,
      count,
      customPricePerProductItem,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

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
    const { customerRoleId, adminRoleId } = authPayload;

    const { count, productItem, pricePerProductItem } = body;

    const productOrder = await this.service.updateOnesItem(
      adminRoleId ? undefined : customerRoleId || undefined,
      productOrderId,
      productOrderItemId,
      productItem?.id,
      count,
      pricePerProductItem,
    );

    return plainToInstance(ProductOrderDto, productOrder);
  }

  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Delete(ProductsEndPoint.ORDER_ITEM)
  async destroyOnesItem(
    @AuthPayload() authPayload: IAuthPayload,
    @Param('product_order_id', ParseIntPipe) productOrderId: number,
    @Param('product_order_item_id', ParseIntPipe) productOrderItemId: number,
  ): Promise<void> {
    const { customerRoleId, adminRoleId } = authPayload;

    await this.service.destroyOnesItem(
      adminRoleId ? undefined : customerRoleId || undefined,
      productOrderId,
      productOrderItemId,
    );
  }

  // endregion
}
