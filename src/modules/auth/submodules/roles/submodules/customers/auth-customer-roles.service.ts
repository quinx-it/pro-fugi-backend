import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRoleAddressesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories';
import { AuthCustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/auth-customer-roles.repository';
import {
  IAuthCustomerRole,
  IAuthCustomerRoleAddress,
} from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AppException, DbUtil, ERROR_MESSAGES, IAddress } from '@/shared';

@Injectable()
export class AuthCustomerRolesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: AuthCustomerRolesRepository,
    private readonly addressesRepo: AuthCustomerRoleAddressesRepository,
  ) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole | null> {
    const customerRole = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return customerRole;
  }

  async createOne(
    userId: number,
    firstName: string | null,
    lastName: string | null,
    address: IAddress | null,
  ): Promise<IAuthCustomerRole> {
    const existingCustomerRole = await this.repo.findOneByUserId(userId, false);

    if (existingCustomerRole) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.ALREADY_EXISTS_TEMPLATE,
        {
          value: 'Auth customer role',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let result: IAuthCustomerRole;

    await this.dataSource.transaction(async (manager) => {
      const authCustomerRole = await this.repo.createOne(
        userId,
        firstName,
        lastName,
        manager,
      );

      if (address !== null) {
        const { id: authCustomerRoleId } = authCustomerRole;

        const { city, street, building, block, apartment } = address;

        await this.addressesRepo.createOne(
          authCustomerRoleId,
          city,
          street,
          building,
          block,
          apartment,
          manager,
        );

        result = await this.repo.findOne(authCustomerRoleId, true, manager);
      }

      result = authCustomerRole;
    });

    return result!;
  }

  async updateOne(
    authUserId: number,
    firstName?: string | null,
    lastName?: string | null,
    address?: IAddress | null,
  ): Promise<IAuthCustomerRole> {
    const result = await this.dataSource.transaction(async (manager) => {
      const authCustomerRoleExisting = await this.repo.findOne(
        authUserId,
        true,
        manager,
      );

      const { id: authCustomerRoleId } = authCustomerRoleExisting;

      if (address !== undefined) {
        const existingAddress: IAuthCustomerRoleAddress | null =
          DbUtil.getRelatedEntityOrThrow<
            IAuthCustomerRole,
            IAuthCustomerRoleAddress
          >(authCustomerRoleExisting, 'address');

        if (existingAddress) {
          await this.addressesRepo.destroyOne(existingAddress.id, manager);
        }

        if (address) {
          const { city, street, building, block, apartment } = address;

          await this.addressesRepo.createOne(
            authCustomerRoleId,
            city,
            street,
            building,
            block,
            apartment,
            manager,
          );
        }
      }

      const authCustomerRole = await this.repo.updateOne(
        authCustomerRoleId,
        firstName,
        lastName,
        manager,
      );

      return authCustomerRole;
    });

    return result;
  }
}
