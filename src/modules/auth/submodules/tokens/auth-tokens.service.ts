import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { IAuthPhoneMethodData } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthMethodsUtil } from '@/modules/auth/submodules/methods/utils';
import { AuthRole } from '@/modules/auth/submodules/roles/constants';
import { AuthRolesUtil } from '@/modules/auth/submodules/roles/utils';
import {
  AuthAccessTokensService,
  AuthRefreshTokensService,
} from '@/modules/auth/submodules/tokens/services';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { AuthPayloadDto } from '@/modules/auth/submodules/users/dtos/auth-payload.dto';
import { IAuthPayload } from '@/modules/auth/submodules/users/types';
import { AuthUsersUtil } from '@/modules/auth/submodules/users/utils';
import {
  AppException,
  ERROR_MESSAGES,
  GLOBAL_VALIDATION_PIPE_OPTIONS,
} from '@/shared';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly refreshService: AuthRefreshTokensService,
    private readonly accessService: AuthAccessTokensService,
    private readonly phoneOptionsService: AuthPhoneMethodsService,
    private readonly usersService: AuthUsersService,
  ) {}

  async createRefreshOneByPhone(data: IAuthPhoneMethodData): Promise<string> {
    const { phone, password } = data;

    const phoneAuthMethod = await this.phoneOptionsService.findLatestOneOfPhone(
      phone,
      true,
    );

    const { authUserId } = phoneAuthMethod;

    const { phone: activePhone } =
      await this.phoneOptionsService.findLatestOneOfUser(authUserId, true);

    if (phone !== activePhone) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.AUTH_METHOD_OF_SUBJECT_NO_LONGER_ACTIVE_TEMPLATE,
        { value: phone },
      );
    }

    await AuthMethodsUtil.isValidPassword(phoneAuthMethod, password, true);

    const user = await this.usersService.findOne(authUserId, true);

    const payload = AuthUsersUtil.getTokenPayload(user);

    const refresh = await this.refreshService.emitOne(payload);

    return refresh;
  }

  async createAccessOne(refresh: string, role?: AuthRole): Promise<string> {
    const refreshTokenPayload =
      await this.refreshService.validateOne<IAuthPayload>(refresh, true);

    await validateOrReject(
      plainToInstance(AuthPayloadDto, refreshTokenPayload),
      GLOBAL_VALIDATION_PIPE_OPTIONS,
    );

    const { authUserId } = refreshTokenPayload;

    const authUser = await this.usersService.findOne(authUserId, true);

    const payload = AuthRolesUtil.getTokenPayload(authUser, role);

    const access = await this.accessService.emitOne(payload);

    return access;
  }
}
