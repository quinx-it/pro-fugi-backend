import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthMethodsService } from '@/modules/auth/submodules/methods/auth-methods.service';
import { CreatePhoneAuthMethodDto } from '@/modules/auth/submodules/methods/submodules/phone/dtos/create-phone-auth-method.dto';
import { AuthTokensDto } from '@/modules/auth/submodules/tokens/dtos';
import { DtosUtil } from '@/shared/utils/dtos.util';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
@ApiExtraModels(CreatePhoneAuthMethodDto)
export class AuthMethodsController {
  constructor(private readonly service: AuthMethodsService) {}

  @DtosUtil.apiBody(CreatePhoneAuthMethodDto)
  @ApiResponse({ type: AuthTokensDto, status: HttpStatus.OK })
  @Post(AuthEndPoint.METHODS)
  async createOne(
    @DtosUtil.body(CreatePhoneAuthMethodDto) body: CreatePhoneAuthMethodDto,
  ): Promise<void> {
    await this.service.createOneByPhone(body);
  }
}
