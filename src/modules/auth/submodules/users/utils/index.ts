import { AuthRolesUtil } from '@/modules/auth/submodules/roles/utils';
import {
  IUser,
  IUserTokenPayload,
} from '@/modules/auth/submodules/users/types';

export class AuthUsersUtil {
  static getTokenPayload(user: IUser): IUserTokenPayload {
    const { id } = user;

    const roles = AuthRolesUtil.getRoles(user);

    return { id, roles };
  }
}
