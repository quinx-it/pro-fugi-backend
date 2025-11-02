import { forwardRef, Module } from '@nestjs/common';

import { AuthConfirmationCodesModule } from '@/modules/auth/submodules/confirmations/auth-confirmation-codes.module';
import { AuthMethodsController } from '@/modules/auth/submodules/methods/auth-methods.controller';
import { AuthMethodsService } from '@/modules/auth/submodules/methods/auth-methods.service';
import { AuthPhoneMethodsModule } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.module';
import { AuthRolesModule } from '@/modules/auth/submodules/roles';
import { AuthUsersModule } from '@/modules/auth/submodules/users/auth-users.module';

@Module({
  imports: [
    AuthPhoneMethodsModule,
    forwardRef(() => AuthConfirmationCodesModule),
    AuthUsersModule,
    AuthRolesModule,
  ],
  providers: [AuthMethodsService],
  controllers: [AuthMethodsController],
  exports: [AuthMethodsService, AuthPhoneMethodsModule],
})
export class AuthMethodsModule {}
