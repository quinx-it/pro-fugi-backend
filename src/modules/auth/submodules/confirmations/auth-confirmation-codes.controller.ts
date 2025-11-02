import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthEndPoint } from '@/modules/auth/constants';
import { AuthConfirmationCodesService } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.service';
import {
  ConfirmationCodeDto,
  CreatePhoneConfirmationCodeDto,
} from '@/modules/auth/submodules/confirmations/dtos';
import { DtosUtil } from '@/shared/utils/dtos.util';

@ApiTags(AuthEndPoint.PREFIX)
@Controller(AuthEndPoint.PREFIX)
@ApiExtraModels(CreatePhoneConfirmationCodeDto)
export class AuthConfirmationCodesController {
  constructor(private readonly service: AuthConfirmationCodesService) {}

  @DtosUtil.apiBody(CreatePhoneConfirmationCodeDto)
  @ApiResponse({ type: ConfirmationCodeDto, status: HttpStatus.CREATED })
  @Post(AuthEndPoint.CONFIRMATION_CODES)
  async createConfirmationCode(
    @DtosUtil.body(CreatePhoneConfirmationCodeDto)
    body: CreatePhoneConfirmationCodeDto,
  ): Promise<ConfirmationCodeDto> {
    const code = await this.service.createPhoneOne(body);

    return plainToInstance(ConfirmationCodeDto, code);
  }
}
