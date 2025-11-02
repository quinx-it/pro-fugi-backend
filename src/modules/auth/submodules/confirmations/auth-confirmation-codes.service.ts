import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { NumericConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/numeric-confirmation-codes.service';
import {
  IConfirmationCodeEntity,
  ICreatePhoneConfirmationCode,
} from '@/modules/auth/submodules/confirmations/types';
import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { AppException, ERROR_MESSAGES, WARNING_MESSAGES } from '@/shared';

@Injectable()
export class AuthConfirmationCodesService {
  private readonly logger = new Logger(AuthConfirmationCodesService.name);

  constructor(
    private readonly numericService: NumericConfirmationCodesService,
    private readonly phoneMethodsService: AuthPhoneMethodsService,
  ) {}

  async createPhoneOne(
    data: ICreatePhoneConfirmationCode,
  ): Promise<IConfirmationCodeEntity> {
    const { phone, ...params } = data;

    const { isNewUser } = params;

    const authMethod = await this.phoneMethodsService.findLatestOne(
      phone,
      false,
    );

    if (authMethod && isNewUser) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_METHODS_SUBJECT_ALREADY_IN_USE_TEMPLATE,
        {
          value: JSON.stringify({ phone }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!authMethod && !isNewUser) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_METHODS_SUBJECT_NOT_IN_USE_TEMPLATE,
        {
          value: JSON.stringify({ phone }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const code = await this.numericService.generateOne(phone, params);

    this.logger.warn(
      WARNING_MESSAGES.AUTH_PHONE_CONFIRMATION_CODE_DELIVERY_NOT_IMPLEMENTED_TEMPLATE.execute(
        { value: JSON.stringify(code, null, 2) },
      ),
    );

    return code;
  }
}
