import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { AuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/auth-customer-role.dto';
import { CreateAuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/create-auth-customer-role.dto';
import { UpdateAuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/update-auth-customer-role.dto';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
export class AuthCustomerRolesController {
  constructor(private readonly service: AuthCustomerRolesService) {}

  @ApiResponse({ type: AuthCustomerRoleDto, status: HttpStatus.CREATED })
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Post(AuthEndPoint.CURRENT_USER_CUSTOMER_ROLE)
  async createOne(
    @AuthPayload() authPayload: IAuthPayload,
    @Body() body: CreateAuthCustomerRoleDto,
  ): Promise<AuthCustomerRoleDto> {
    const { address, firstName, lastName } = body;
    const { authUserId } = authPayload;

    const customerRole = await this.service.createOne(
      authUserId,
      firstName,
      lastName,
      address,
    );

    return plainToInstance(AuthCustomerRoleDto, customerRole);
  }

  @ApiResponse({ type: AuthCustomerRoleDto, status: HttpStatus.CREATED })
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Patch(AuthEndPoint.CURRENT_USER_CUSTOMER_ROLE)
  async updateOne(
    @AuthPayload() authPayload: IAuthPayload,
    @Body() body: UpdateAuthCustomerRoleDto,
  ): Promise<AuthCustomerRoleDto> {
    const { address, firstName, lastName } = body;
    const { authUserId } = authPayload;

    const customerRole = await this.service.updateOne(
      authUserId,
      firstName,
      lastName,
      address,
    );

    return plainToInstance(AuthCustomerRoleDto, customerRole);
  }
}
