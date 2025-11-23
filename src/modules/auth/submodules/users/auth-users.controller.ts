import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { AuthUserDto } from '@/modules/auth/submodules/users/dtos/auth-user.dto';
import { AuthUsersPaginatedDto } from '@/modules/auth/submodules/users/dtos/auth-users-paginated.dto';
import { FindAuthUsersDto } from '@/modules/auth/submodules/users/dtos/find-auth-users.dto';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
export class AuthUsersController {
  constructor(private readonly service: AuthUsersService) {}

  @ApiResponse({ type: AuthUserDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Get(AuthEndPoint.CURRENT_USER)
  async findOneByAuth(
    @AuthPayload() authPayload: IAuthPayload,
  ): Promise<AuthUserDto> {
    const { authUserId } = authPayload;

    const user = await this.service.findOne(authUserId, true);

    return plainToInstance(AuthUserDto, user);
  }

  @ApiResponse({ type: AuthUsersPaginatedDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Get(AuthEndPoint.USERS)
  async findMany(
    @Query() query: FindAuthUsersDto,
  ): Promise<AuthUsersPaginatedDto> {
    const { filter, sort, pagination } = query;

    const user = await this.service.findManyPaginated(filter, sort, pagination);

    return plainToInstance(AuthUsersPaginatedDto, user);
  }
}
