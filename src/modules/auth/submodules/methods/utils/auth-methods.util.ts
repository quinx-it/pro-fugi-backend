import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

export class AuthMethodsUtil {
  static async isValidPassword(
    authMethod: IAuthPhoneMethod,
    password: string,
    throwIfInvalid: false,
  ): Promise<boolean>;

  static async isValidPassword(
    authMethod: IAuthPhoneMethod,
    password: string,
    throwIfInvalid: true,
  ): Promise<true>;

  static async isValidPassword(
    authMethod: IAuthPhoneMethod,
    password: string,
    throwIfInvalid: boolean,
  ): Promise<boolean> {
    const { password: passwordHash } = authMethod;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (throwIfInvalid && !isPasswordValid) {
      throw new AppException(
        ERROR_MESSAGES.AUTH_METHODS_WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    return isPasswordValid;
  }
}
