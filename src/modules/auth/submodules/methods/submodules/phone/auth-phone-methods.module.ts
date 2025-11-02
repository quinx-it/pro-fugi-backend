import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities/auth-phone-method.entity';
import { AuthPhoneMethodsRepository } from '@/modules/auth/submodules/methods/submodules/phone/repositories/auth-phone-methods-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthPhoneMethodEntity])],
  providers: [AuthPhoneMethodsService, AuthPhoneMethodsRepository],
  exports: [AuthPhoneMethodsService],
})
export class AuthPhoneMethodsModule {}
