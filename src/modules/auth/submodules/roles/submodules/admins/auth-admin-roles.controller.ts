import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthAdminRolesService } from '@/modules/auth/submodules/roles/submodules';
import {
  AuthAdminRoleDto,
  CreateAuthAdminRoleDto,
  UpdateAuthAdminRoleDto,
} from '@/modules/auth/submodules/roles/submodules/admins/dtos';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
export class AuthAdminRolesController {
  constructor(private readonly service: AuthAdminRolesService) {}

  @ApiResponse({ type: AuthAdminRoleDto, status: HttpStatus.CREATED })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Post(AuthEndPoint.USERS_ADMIN_ROLE)
  async createOne(
    @Param('auth_user_id', ParseIntPipe) authUserId: number,
    @Body() body: CreateAuthAdminRoleDto,
  ): Promise<AuthAdminRoleDto> {
    const { name } = body;

    const authAdminRole = await this.service.createOne(authUserId, name);

    return plainToInstance(AuthAdminRoleDto, authAdminRole);
  }

  @ApiResponse({ type: AuthAdminRoleDto, status: HttpStatus.OK })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Patch(AuthEndPoint.USERS_ADMIN_ROLE)
  async updateOneByAdmin(
    @Param('auth_user_id', ParseIntPipe) authUserId: number,
    @Body() body: UpdateAuthAdminRoleDto,
  ): Promise<AuthAdminRoleDto> {
    const { name } = body;

    const authAdminRole = await this.service.updateOne(authUserId, name);

    return plainToInstance(AuthAdminRoleDto, authAdminRole);
  }

  @ApiResponse({ type: AuthAdminRoleDto, status: HttpStatus.OK })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Patch(AuthEndPoint.CURRENT_USER_ADMIN_ROLE)
  async updateOneByAuth(
    @AuthPayload() authPayload: IAuthPayload,
    @Body() body: UpdateAuthAdminRoleDto,
  ): Promise<AuthAdminRoleDto> {
    const { authUserId } = authPayload;
    const { name } = body;

    const authAdminRole = await this.service.updateOne(authUserId, name);

    return plainToInstance(AuthAdminRoleDto, authAdminRole);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Delete(AuthEndPoint.USERS_ADMIN_ROLE)
  async destroyOne(
    @Param('auth_user_id', ParseIntPipe) authUserId: number,
  ): Promise<void> {
    await this.service.destroyOne(authUserId);
  }
}
