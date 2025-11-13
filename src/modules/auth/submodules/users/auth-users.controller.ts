import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { AuthUserDto } from '@/modules/auth/submodules/users/dtos/auth-user.dto';
import { UpdateAuthUserDto } from '@/modules/auth/submodules/users/dtos/update-auth-user.dto';
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
    const { userId } = authPayload;

    const user = await this.service.findOne(userId, true);

    return plainToInstance(AuthUserDto, user);
  }

  @ApiResponse({ type: AuthUserDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(AuthEndPoint.CURRENT_USER)
  async updateOneByAuth(
    @AuthPayload() authPayload: IAuthPayload,
    @Body() body: UpdateAuthUserDto,
  ): Promise<AuthUserDto> {
    const { userId } = authPayload;

    const { authCustomerRole } = body;

    const user = await this.service.updateOne(userId, authCustomerRole);

    return plainToInstance(AuthUserDto, user);
  }
}
