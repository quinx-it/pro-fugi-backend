import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { NumericConfirmationCodesService } from '@/modules/auth/submodules/confirmations/services/numeric-confirmation-codes.service';
import { AuthPhoneMethodsService } from '@/modules/auth/submodules/methods/submodules/phone/auth-phone-methods.service';
import { ICreatePhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { IAuthMethod } from '@/modules/auth/submodules/methods/types';
import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { AuthUsersService } from '@/modules/auth/submodules/users/auth-users.service';

@Injectable()
export class AuthMethodsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly numericConfirmationCodesService: NumericConfirmationCodesService,
    private readonly phoneOptionsService: AuthPhoneMethodsService,
    private readonly usersService: AuthUsersService,
    private readonly customerRolesService: AuthCustomerRolesService,
  ) {}

  async createOneByPhone(data: ICreatePhoneMethod): Promise<IAuthMethod> {
    const { confirmationCode, password, phone, isNewUser } = data;

    const confirmationCodeParams = { isNewUser };

    await this.numericConfirmationCodesService.validateOne(
      phone,
      confirmationCodeParams,
      confirmationCode,
      true,
    );

    const oldAuthMethod = await this.phoneOptionsService.findLatestOne(
      phone,
      false,
    );

    const result = await this.dataSource.transaction(async (manager) => {
      const userId =
        oldAuthMethod?.authUserId ||
        (await this.usersService.createOne(manager)).id;

      await this.usersService.findOne(userId, true, manager);

      const authMethod = await this.phoneOptionsService.createOne(
        userId,
        phone,
        password,
        manager,
      );

      return authMethod;
    });

    await this.numericConfirmationCodesService.utilizeOne(
      phone,
      confirmationCodeParams,
      confirmationCode,
    );

    return result;
  }
}
