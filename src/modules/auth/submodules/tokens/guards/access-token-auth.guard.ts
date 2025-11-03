import { AccessTokenOptionalAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-optional.auth-guard';
import { AccessTokenRequiredAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-required.auth-guard';

export class AccessTokenAuthGuard {
  static REQUIRED = AccessTokenRequiredAuthGuard;

  static OPTIONAL = AccessTokenOptionalAuthGuard;
}
