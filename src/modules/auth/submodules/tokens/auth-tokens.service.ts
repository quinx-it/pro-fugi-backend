import { Injectable } from '@nestjs/common';

import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { IAuthPhoneMethodData } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthMethodsUtil } from '@/modules/auth/submodules/methods/utils';
import {
  AuthAccessTokensService,
  AuthRefreshTokensService,
} from '@/modules/auth/submodules/tokens/services';
import { IAuthTokens } from '@/modules/auth/submodules/tokens/types';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { AuthUserDto } from '@/modules/auth/submodules/users/dtos/auth-user.dto';
import { AuthUsersUtil } from '@/modules/auth/submodules/users/utils';
import { IAuthRefreshData } from '@/modules/auth/types';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly refreshService: AuthRefreshTokensService,
    private readonly accessService: AuthAccessTokensService,
    private readonly phoneOptionsService: AuthPhoneMethodsService,
    private readonly usersService: AuthUsersService,
  ) {}

  async createPairByPhone(data: IAuthPhoneMethodData): Promise<IAuthTokens> {
    const { phone, password } = data;

    const authMethod = await this.phoneOptionsService.findLatestOne(
      phone,
      true,
    );

    await AuthMethodsUtil.isValidPassword(authMethod, password, true);

    const { authUserId } = authMethod;

    const user = await this.usersService.findOne(authUserId, true);

    const payload = AuthUsersUtil.getTokenPayload(user);

    const access = await this.accessService.emitOne(payload);
    const refresh = await this.refreshService.emitOne(payload);

    return { access, refresh };
  }

  async createPairByRefresh(data: IAuthRefreshData): Promise<IAuthTokens> {
    const { refresh } = data;

    const payload = await this.refreshService.validateOne<AuthUserDto>(
      refresh,
      true,
    );

    const access = await this.accessService.emitOne(payload);

    return { access, refresh };
  }
}
