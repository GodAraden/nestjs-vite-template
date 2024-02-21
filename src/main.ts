import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 打包后的产物不会用到 vite，所以仅在 PROD 模式下调用 app.listen 方法
  if (import.meta.env.PROD) await app.listen(8888);
  return app;
}

export const appServer = bootstrap();
