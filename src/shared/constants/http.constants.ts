export enum HttpSameSiteOption {
  NONE = 'none',
  LAX = 'lax',
  STRICT = 'strict',
}

export const enum HttpContentType {
  APPLICATION_JSON = 'application/json',
}

export const enum HttpHeader {
  CONTENT_TYPE = 'Content-Type',
  AUTHORIZATION = 'Authorization',
  ORIGIN = 'Origin',
  X_API_KEY = 'X-API-Key',
}

export const enum CookieName {
  AUTH_SESSION_ID = 'connect.sid',
  LANGUAGE = 'language',
}

export const HTTP_ALLOWED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
];

export const HTTP_ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'Cookie'];
