import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { NumericConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/numeric-confirmation-codes.service';
import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { ICreatePhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { IAuthMethod } from '@/modules/auth/submodules/methods/types';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';
import { DbUtil } from '@/shared';

@Injectable()
export class AuthMethodsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly numericConfirmationCodesService: NumericConfirmationCodesService,
    private readonly phoneOptionsService: AuthPhoneMethodsService,
    private readonly usersService: AuthUsersService,
  ) {}

  async createOneByPhone(
    data: ICreatePhoneMethod,
    manager: EntityManager | null = null,
  ): Promise<IAuthMethod> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const { confirmationCode, password, phone, isNewUser } = data;

        const confirmationCodeParams = { isNewUser };

        await this.numericConfirmationCodesService.validateOne(
          phone,
          confirmationCodeParams,
          confirmationCode,
          true,
        );

        const oldAuthMethod =
          await this.phoneOptionsService.findLatestOneOfPhone(phone, false);

        const userId =
          oldAuthMethod?.authUserId ||
          (await this.usersService.createOne(manager)).id;

        await this.usersService.findOne(userId, true, transactionManager);

        const authMethod = await this.phoneOptionsService.createOne(
          userId,
          phone,
          password,
          transactionManager,
        );

        await this.numericConfirmationCodesService.utilizeOne(
          phone,
          confirmationCodeParams,
          confirmationCode,
        );

        return authMethod;
      },
      this.dataSource,
      manager,
    );
  }
}
