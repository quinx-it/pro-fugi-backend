import { forwardRef, Module } from '@nestjs/common';

import { AuthConfirmationCodesController } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.controller';
import { AuthConfirmationCodesService } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.service';
import { ConfirmationCodesRepository } from '@/modules/auth/submodules/confirmations/repositories/confirmation-codes.repository';
import { NumericConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/numeric-confirmation-codes.service';
import { AuthMethodsModule } from '@/modules/auth/submodules/methods';
import { AuthUsersModule } from '@/modules/auth/submodules/users/auth-users.module';
import { RedisModule } from '@/modules/redis';

@Module({
  imports: [RedisModule, forwardRef(() => AuthMethodsModule), AuthUsersModule],
  providers: [
    ConfirmationCodesRepository,
    NumericConfirmationCodesService,
    AuthConfirmationCodesService,
  ],
  controllers: [AuthConfirmationCodesController],
  exports: [NumericConfirmationCodesService],
})
export class AuthConfirmationCodesModule {}
