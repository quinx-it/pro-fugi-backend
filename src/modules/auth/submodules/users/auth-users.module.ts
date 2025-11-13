import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthRolesModule } from '@/modules/auth/submodules';
import { AuthTokensModule } from '@/modules/auth/submodules/tokens';
import { AuthUsersController } from '@/modules/auth/submodules/users/auth-users.controller';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { AuthUserEntity } from '@/modules/auth/submodules/users/entities';
import { AuthUsersRepository } from '@/modules/auth/submodules/users/repositories/auth-users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUserEntity]),
    forwardRef(() => AuthTokensModule),
    forwardRef(() => AuthRolesModule),
  ],
  providers: [AuthUsersRepository, AuthUsersService],
  controllers: [AuthUsersController],
  exports: [AuthUsersService],
})
export class AuthUsersModule {}
