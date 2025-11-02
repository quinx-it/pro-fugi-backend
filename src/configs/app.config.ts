import fs from 'fs';
import path from 'path';

import {
  ClassSerializerInterceptor,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import {
  APP_ENV,
  APP_HOST_NAME,
  APP_HOST_PORT,
  APP_CONTAINER_PORT,
  APP_USE_SSL,
  APP_TRUST_PROXY_LEVEL,
} from '@/configs/env';
import { GLOBAL_VALIDATION_PIPE_OPTIONS } from '@/shared';

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
}
