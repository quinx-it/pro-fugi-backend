import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AdminUserAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { UID } from '@/modules/auth/submodules/users/decorators';
import { UserDto } from '@/modules/auth/submodules/users/dtos/user.dto';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
export class AuthUsersController {
  constructor(private readonly service: AuthUsersService) {}

  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(AdminUserAuthGuard)
  @UseGuards(AccessTokenAuthGuard)
  @Get(AuthEndPoint.USERS_USER)
  async findOneByAuth(@UID() userId: number): Promise<UserDto> {
    const user = await this.service.findOne(userId, true);

    return plainToInstance(UserDto, user);
  }
}
