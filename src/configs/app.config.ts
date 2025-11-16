import fs from 'fs';
import path from 'path';

import {
  ClassSerializerInterceptor,
  HttpStatus,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import {
  APP_ENV,
  APP_HOST_NAME,
  APP_HOST_PORT,
  APP_CONTAINER_PORT,
  APP_USE_SSL,
  APP_TRUST_PROXY_LEVEL,
  APP_ALLOWED_ORIGINS,
} from '@/configs/env';
import {
  AppException,
  ERROR_MESSAGES,
  GLOBAL_VALIDATION_PIPE_OPTIONS,
  HTTP_ALLOWED_HEADERS,
  HTTP_ALLOWED_METHODS,
} from '@/shared';

import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

export const appConfig = {
  environment: APP_ENV,
  hostName: APP_HOST_NAME,
  hostPort: APP_HOST_PORT,
  containerPort: APP_CONTAINER_PORT,
  useSSL: APP_USE_SSL,
  trustProxyLevel: APP_TRUST_PROXY_LEVEL,
};

export class AppConfigUtil {
  static getHttpsOptions(useSSL: boolean): HttpsOptions | undefined {
    const httpOptions = useSSL
      ? {
          key: fs.readFileSync(
            path.join(__dirname, '..', '..', 'ssl', 'key.pem'),
          ),
          cert: fs.readFileSync(
            path.join(__dirname, '..', '..', 'ssl', 'cert.pem'),
          ),
        }
      : undefined;

    return httpOptions;
  }

  static setupGlobalInterceptors(app: INestApplication): void {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get('Reflector')),
    );
  }

  static setupGlobalValidationPipe(app: INestApplication): void {
    app.useGlobalPipes(new ValidationPipe(GLOBAL_VALIDATION_PIPE_OPTIONS));
  }

  static setupCors(app: INestApplication): void {
    app.enableCors({
      origin: (origin, callback) => {
        if (APP_ALLOWED_ORIGINS.includes('*')) {
          return callback(null, true);
        }

        if (!origin || APP_ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        return callback(
          new AppException(
            ERROR_MESSAGES.ORIGIN_FORBIDDEN,
            HttpStatus.FORBIDDEN,
          ),
        );
      },
      allowedHeaders: HTTP_ALLOWED_HEADERS,
      methods: HTTP_ALLOWED_METHODS,
      credentials: true,
    } as CorsOptions);
  }
}
