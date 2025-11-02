import { join } from 'path';

export enum AppEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum AppExpressParam {
  TRUST_PROXY = 'trust proxy',
}

export enum ContextTypeExtended {
  TELEGRAF = 'telegraf',
  HTTP = 'http',
  WS = 'ws',
  RPC = 'rpc',
}

export const GLOBAL_VALIDATION_PIPE_OPTIONS = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};

export const SERVE_STATIC_OPTIONS = {
  rootPath: join(__dirname, '..', '..', '..', 'static'),
  serveRoot: '/static',
};
