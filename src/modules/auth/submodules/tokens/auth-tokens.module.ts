import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { authConfig } from '@/configs';
import { AuthMethodsModule } from '@/modules/auth/submodules/methods';
import { AuthTokensController } from '@/modules/auth/submodules/tokens/auth-tokens.controller';
import { AuthTokensService } from '@/modules/auth/submodules/tokens/auth-tokens.service';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { AuthAccessTokensService } from '@/modules/auth/submodules/tokens/services/auth-access-tokens.service';
import { AuthRefreshTokensService } from '@/modules/auth/submodules/tokens/services/auth-refresh-tokens.service';
import { AuthTokensInternalService } from '@/modules/auth/submodules/tokens/services/auth-tokens-internal.service';
import { AuthUsersModule } from '@/modules/auth/submodules/users/auth-users.module';

const { access } = authConfig;

@Module({
  imports: [
    JwtModule.register(access),
    forwardRef(() => AuthMethodsModule),
    forwardRef(() => AuthUsersModule),
  ],
  providers: [
    AuthTokensInternalService,
    AuthRefreshTokensService,
    AuthAccessTokensService,
    AccessTokenAuthGuard,
    AuthTokensService,
  ],
  controllers: [AuthTokensController],
  exports: [
    AccessTokenAuthGuard,
    AuthAccessTokensService,
    AuthRefreshTokensService,
  ],
})
export class AuthTokensModule {}
