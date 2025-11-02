import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { appConfig, AppConfigUtil, DocsUtil, LoggerUtil } from '@/configs';
import { AppExpressParam } from '@/shared';

import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const { useSSL } = appConfig;

  const logger = LoggerUtil.get();
  const httpsOptions = AppConfigUtil.getHttpsOptions(useSSL);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
    logger,
  });

  AppConfigUtil.setupGlobalValidationPipe(app);
  AppConfigUtil.setupGlobalInterceptors(app);

  const { trustProxyLevel } = appConfig;

  app.set(AppExpressParam.TRUST_PROXY, trustProxyLevel);

  DocsUtil.setup(app);

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  const { containerPort } = appConfig;

  await app.listen(containerPort);
}

bootstrap();
