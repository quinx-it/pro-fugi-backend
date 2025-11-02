import {
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthTokensService } from '@/modules/auth/submodules/tokens/auth-tokens.service';
import {
  AuthTokensDto,
  CreateAuthTokensByRefreshDto,
} from '@/modules/auth/submodules/tokens/dtos';
import { CreateAuthTokensByPhoneDto } from '@/modules/auth/submodules/tokens/dtos/create-auth-tokens-by-phone.dto';
import { IAuthTokens } from '@/modules/auth/submodules/tokens/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
@ApiExtraModels(CreateAuthTokensByRefreshDto, CreateAuthTokensByPhoneDto)
export class AuthTokensController {
  constructor(private readonly service: AuthTokensService) {}

  @DtosUtil.apiBody(CreateAuthTokensByPhoneDto, CreateAuthTokensByRefreshDto)
  @ApiResponse({ type: AuthTokensDto, status: HttpStatus.CREATED })
  @Post(AuthEndPoint.TOKENS)
  async createPair(
    @DtosUtil.body(CreateAuthTokensByPhoneDto, CreateAuthTokensByRefreshDto)
    body: CreateAuthTokensByPhoneDto | CreateAuthTokensByRefreshDto,
  ): Promise<AuthTokensDto> {
    let tokens: IAuthTokens | undefined;

    if (body instanceof CreateAuthTokensByPhoneDto) {
      tokens = await this.service.createPairByPhone(body);
    }

    if (body instanceof CreateAuthTokensByRefreshDto) {
      tokens = await this.service.createPairByRefresh(body);
    }

    if (!tokens) {
      throw new InternalServerErrorException();
    }

    return plainToInstance(AuthTokensDto, tokens);
  }
}
