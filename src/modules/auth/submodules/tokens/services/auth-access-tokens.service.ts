import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';

import { authConfig } from '@/configs';
import { AuthConfiguredTokenService } from '@/modules/auth/submodules/tokens/services/auth-configured-token.service';

@Injectable()
export class AuthAccessTokensService extends AuthConfiguredTokenService {
  get config(): JwtSignOptions {
    const { access } = authConfig;

    return access;
  }
}
