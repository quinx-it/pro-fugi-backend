export const AUTH_USERS_SEARCH_VIEW_SQL_NAME = 'auth_users_search_view';

export enum AuthEndPoint {
  PREFIX = 'auth',
  ACCESS_TOKENS = 'tokens/access',
  REFRESH_TOKENS = 'tokens/refresh',
  CONFIRMATION_CODES = 'confirmation/codes',
  METHODS = 'methods',
  USERS = 'users/all',
  CURRENT_USER = 'users/user',
  USERS_ADMIN_ROLE = 'users/all/:auth_user_id/roles/admin',
  CURRENT_USER_CUSTOMER_ROLE = 'users/user/roles/customer',
  CURRENT_USER_ADMIN_ROLE = 'users/user/roles/admin',
}
