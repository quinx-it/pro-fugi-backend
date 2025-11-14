import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthTokensService } from '@/modules/auth/submodules/tokens/auth-tokens.service';
import {
  AuthTokensDto,
  CreateAuthAccessTokenByRefreshDto,
} from '@/modules/auth/submodules/tokens/dtos';
import { CreateAuthRefreshTokensByPhoneDto } from '@/modules/auth/submodules/tokens/dtos/create-auth-refresh-tokens-by-phone.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
@ApiExtraModels(
  CreateAuthAccessTokenByRefreshDto,
  CreateAuthRefreshTokensByPhoneDto,
)
export class AuthTokensController {
  constructor(private readonly service: AuthTokensService) {}

  @DtosUtil.apiBody(CreateAuthRefreshTokensByPhoneDto)
  @ApiResponse({ type: AuthTokensDto, status: HttpStatus.CREATED })
  @Post(AuthEndPoint.REFRESH_TOKENS)
  async createRefreshOne(
    @DtosUtil.body(CreateAuthRefreshTokensByPhoneDto)
    body: CreateAuthRefreshTokensByPhoneDto,
  ): Promise<string> {
    const token = await this.service.createRefreshOneByPhone(body);

    return token;
  }

  @DtosUtil.apiBody(CreateAuthAccessTokenByRefreshDto)
  @ApiResponse({ type: AuthTokensDto, status: HttpStatus.CREATED })
  @Post(AuthEndPoint.ACCESS_TOKENS)
  async createAccessOne(
    @DtosUtil.body(CreateAuthAccessTokenByRefreshDto)
    body: CreateAuthAccessTokenByRefreshDto,
  ): Promise<string> {
    const { refresh, authRole } = body;

    const token = await this.service.createAccessOne(refresh, authRole);

    return token;
  }
}
