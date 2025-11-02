import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokensModule } from '@/modules/auth/submodules/tokens';
import { AuthUsersController } from '@/modules/auth/submodules/users/auth-users.controller';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { UserEntity } from '@/modules/auth/submodules/users/entities';
import { UsersRepository } from '@/modules/auth/submodules/users/repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthTokensModule),
  ],
  providers: [UsersRepository, AuthUsersService],
  controllers: [AuthUsersController],
  exports: [AuthUsersService],
})
export class AuthUsersModule {}
