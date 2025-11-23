/* eslint-disable no-console */
import readlineSync from 'readline-sync';
import { EntityManager } from 'typeorm';

import dataSource from '@/configs/db.config';
import { AuthPhoneMethodEntity } from '@/modules/auth/submodules/methods/submodules/phone/entities';
import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';

const MESSAGES = {
  INFO: {
    ENTER_PHONE_NUMBER:
      'To assign an admin role, enter the user’s current auth phone number:',
    ENTER_ADMIN_NICKNAME: 'Enter a nickname for the admin role:',
    CREATED_TEMPLATE: 'The user has been successfully assigned an admin role.',
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found.',
    USER_HAS_NO_ACTIVE_AUTH_METHOD: 'The user has no active auth methods.',
    USER_AUTH_METHOD_NOT_ACTIVE:
      'The phone number entered is not an active auth method for this user.',
    USER_ADMIN_ROLE_ALREADY_EXISTS:
      'An admin role for this user already exists.',
  },
};

async function findAuthUserId(
  phone: string,
  manager: EntityManager,
): Promise<number> {
  const [latestAuthMethodOfPhone] = (
    await manager.find(AuthPhoneMethodEntity, {
      where: { phone },
    })
  ).sort(
    (a: AuthPhoneMethodEntity, b: AuthPhoneMethodEntity) =>
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  if (!latestAuthMethodOfPhone) {
    throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
  }

  const { authUserId } = latestAuthMethodOfPhone;

  const [latestAuthMethodOfUser] = (
    await manager.find(AuthPhoneMethodEntity, {
      where: { authUserId },
    })
  ).sort(
    (a: AuthPhoneMethodEntity, b: AuthPhoneMethodEntity) =>
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  if (!latestAuthMethodOfPhone) {
    throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
  }

  if (latestAuthMethodOfUser.id !== latestAuthMethodOfPhone.id) {
    throw new Error(MESSAGES.ERROR.USER_HAS_NO_ACTIVE_AUTH_METHOD);
  }

  return authUserId;
}

async function validateAdmins(
  authUserId: number,
  manager: EntityManager,
): Promise<void> {
  const existingAdminRole = await manager.findOne(AuthAdminRoleEntity, {
    where: { authUserId },
  });

  if (existingAdminRole) {
    throw new Error(MESSAGES.ERROR.USER_ADMIN_ROLE_ALREADY_EXISTS);
  }
}

async function createAdminRole(
  authUserId: number,
  name: string,
  manager: EntityManager,
): Promise<IAuthAdminRole> {
  const adminRole = await manager.save(AuthAdminRoleEntity, {
    authUserId,
    name,
  });

  return adminRole;
}

async function run(): Promise<void> {
  try {
    await dataSource.initialize();

    const { manager } = dataSource;

    const phone = readlineSync.question(MESSAGES.INFO.ENTER_PHONE_NUMBER, {
      hideEchoBack: false,
    });

    const authUserId = await findAuthUserId(phone, manager);

    await validateAdmins(authUserId, manager);

    const name = readlineSync.question(MESSAGES.INFO.ENTER_ADMIN_NICKNAME, {
      hideEchoBack: false,
    });

    await createAdminRole(authUserId, name, manager);

    console.log(MESSAGES.INFO.CREATED_TEMPLATE);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

run().then(() => undefined);
