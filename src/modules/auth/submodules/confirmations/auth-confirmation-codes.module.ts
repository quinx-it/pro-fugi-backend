import { forwardRef, Module } from '@nestjs/common';

import { redisConfig } from '@/configs';
import { AuthTokensModule } from '@/modules/auth/submodules';
import { AuthConfirmationCodesController } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.controller';
import { AuthConfirmationCodesService } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.service';
import { ConfirmationCodesRepository } from '@/modules/auth/submodules/confirmations/repositories/confirmation-codes.repository';
import { NumericConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/numeric-confirmation-codes.service';
import { AuthMethodsModule } from '@/modules/auth/submodules/methods';
import { AuthUsersModule } from '@/modules/auth/submodules/users/auth-users.module';
import { RedisUtil } from '@/shared/utils/redis.util';

@Module({
  imports: [
    RedisUtil.getModule(redisConfig),
    forwardRef(() => AuthMethodsModule),
    AuthUsersModule,
    AuthTokensModule,
  ],
  providers: [
    ConfirmationCodesRepository,
    NumericConfirmationCodesService,
    AuthConfirmationCodesService,
  ],
  controllers: [AuthConfirmationCodesController],
  exports: [NumericConfirmationCodesService],
})
export class AuthConfirmationCodesModule {}
