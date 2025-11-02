import { Module } from '@nestjs/common';

import { AuthConfirmationCodesModule } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.module';
import { AuthMethodsModule } from '@/modules/auth/submodules/methods';
import { AuthRolesModule } from '@/modules/auth/submodules/roles';
import { AuthTokensModule } from '@/modules/auth/submodules/tokens/auth-tokens.module';
import { AuthUsersModule } from '@/modules/auth/submodules/users/auth-users.module';

@Module({
  imports: [
    AuthConfirmationCodesModule,
    AuthTokensModule,
    AuthMethodsModule,
    AuthRolesModule,
    AuthUsersModule,
  ],
  exports: [AuthMethodsModule, AuthTokensModule],
})
export class AuthModule {}
