import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { AccessTokenAbstractAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-abstract.auth-guard';
import { AuthAccessTokensService } from '@/modules/auth/submodules/tokens/services';

@Injectable()
export class AccessTokenOptionalAuthGuard extends AccessTokenAbstractAuthGuard {
  constructor(protected authAccessService: AuthAccessTokensService) {
    super(authAccessService);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTokenInvalid(request: Request): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTokenNotFound(request: Request): boolean {
    return true;
  }
}
