import { config } from 'dotenv';
import { cleanEnv, str, bool, host, port, num } from 'envalid';

import { AppEnvironment } from '@/shared/constants/app.constants';
import { EnvUtil } from '@/shared/utils/env.util';

config();

export const env = cleanEnv(process.env, {
  APP_ENV: str({ choices: Object.values(AppEnvironment) }),
  APP_HOST_NAME: host(),
  APP_HOST_PORT: port(),
  APP_CONTAINER_PORT: port({ default: undefined }),
  APP_USE_SSL: bool(),
  APP_TRUST_PROXY_LEVEL: EnvUtil.numOrBool(),
  APP_ALLOWED_ORIGINS: EnvUtil.strArray(),

  DB_HOST_NAME: host(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_HOST_PORT: port(),
  DB_CONTAINER_PORT: port({ default: undefined }),
  DB_USERNAME: str(),

  REDIS_HOST_NAME: host(),
  REDIS_PASSWORD: str(),
  REDIS_HOST_PORT: port(),
  REDIS_CONTAINER_PORT: port({ default: undefined }),
  REDIS_USERNAME: str(),
  REDIS_CACHE_TTL: EnvUtil.msStringValue(),
  REDIS_DB_INDEX: num(),

  AUTH_REFRESH_SECRET: str(),
  AUTH_REFRESH_EXPIRES_IN: EnvUtil.msStringValue(),
  AUTH_ACCESS_SECRET: str(),
  AUTH_ACCESS_EXPIRES_IN: EnvUtil.msStringValue(),
  AUTH_PASSWORD_SALTING_ROUNDS: num(),
  AUTH_PHONE_CONFIRMATION_CODE_LENGTH: num(),
  AUTH_PHONE_CONFIRMATION_CODE_EXPIRES_IN: EnvUtil.msStringValue(),

  PRODUCTS_SHIPPING_PRICE: num(),
  PRODUCTS_FREE_SHIPPING_THRESHOLD: num(),
  PRODUCTS_DISCOUNT_POLICY: EnvUtil.productDiscountPolicy(),
  PRODUCTS_FAVOURITES_LIMIT: num(),

  SUPPORT_TELEGRAM_BOT_ENABLED: bool(),
  SUPPORT_TELEGRAM_BOT_TOKEN: str({ default: undefined }),
  SUPPORT_TELEGRAM_BOT_ADMIN_CHAT_ID: num({ default: undefined }),
});

export const APP_CONTAINER_PORT = env.APP_CONTAINER_PORT || env.APP_HOST_PORT;

export const {
  APP_ENV,
  APP_HOST_NAME,
  APP_HOST_PORT,
  APP_USE_SSL,
  APP_TRUST_PROXY_LEVEL,
  APP_ALLOWED_ORIGINS,
  DB_HOST_NAME,
  DB_NAME,
  DB_PASSWORD,
  DB_HOST_PORT,
  DB_USERNAME,
  REDIS_HOST_NAME,
  REDIS_PASSWORD,
  REDIS_HOST_PORT,
  REDIS_USERNAME,
  REDIS_CACHE_TTL,
  REDIS_DB_INDEX,
  AUTH_REFRESH_SECRET,
  AUTH_REFRESH_EXPIRES_IN,
  AUTH_ACCESS_SECRET,
  AUTH_ACCESS_EXPIRES_IN,
  AUTH_PASSWORD_SALTING_ROUNDS,
  AUTH_PHONE_CONFIRMATION_CODE_LENGTH,
  AUTH_PHONE_CONFIRMATION_CODE_EXPIRES_IN,
  PRODUCTS_FREE_SHIPPING_THRESHOLD,
  PRODUCTS_SHIPPING_PRICE,
  PRODUCTS_DISCOUNT_POLICY,
  PRODUCTS_FAVOURITES_LIMIT,
  SUPPORT_TELEGRAM_BOT_ENABLED,
  SUPPORT_TELEGRAM_BOT_ADMIN_CHAT_ID,
  SUPPORT_TELEGRAM_BOT_TOKEN,
} = env;
