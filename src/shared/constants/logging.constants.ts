export const enum NestLoggingLevel {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}

export const enum WinstonLoggingLevel {
  SILLY = 'silly',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  HTTP = 'http',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const IGNORED_CONTEXTS = [
  'RoutesResolver',
  'RouterExplorer',
  'InstanceLoader',
];

export const LEVELS_ALLOWED_FOR_IGNORED = [
  NestLoggingLevel.WARN,
  NestLoggingLevel.ERROR,
];
