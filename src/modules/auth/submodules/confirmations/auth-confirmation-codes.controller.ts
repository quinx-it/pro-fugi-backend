import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthConfirmationCodesService } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.service';
import {
  ConfirmationCodeDto,
  CreatePhoneConfirmationCodeDto,
} from '@/modules/auth/submodules/confirmations/dtos';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthPayload } from '@/modules/auth/submodules/users/decorators';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
@ApiExtraModels(CreatePhoneConfirmationCodeDto)
export class AuthConfirmationCodesController {
  constructor(private readonly service: AuthConfirmationCodesService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard.OPTIONAL)
  @DtosUtil.apiBody(CreatePhoneConfirmationCodeDto)
  @ApiResponse({ type: ConfirmationCodeDto, status: HttpStatus.CREATED })
  @Post(AuthEndPoint.CONFIRMATION_CODES)
  async createConfirmationCode(
    @AuthPayload({ isNullable: true }) authPayload: IAuthPayload,
    @DtosUtil.body(CreatePhoneConfirmationCodeDto)
    body: CreatePhoneConfirmationCodeDto,
  ): Promise<ConfirmationCodeDto> {
    const { userId } = authPayload || { userId: null };

    const code = await this.service.createPhoneOne(userId, body);

    return plainToInstance(ConfirmationCodeDto, code);
  }
}
