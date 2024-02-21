# NestJS + vite + vitest

## 创建新项目

```bash
nest new nest_vite_demo
cd nest_vite_demo
pnpm add vite vite-plugin-node @swc/core vitest -D
pnpm remove @types/jest jest ts-jest
rm -rf test
```

## 修改 package.json 中 scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "format": "prettier --write \"src/**/*.ts\"",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  }
}
```

## tsconfig.json 添加配置项

```json
{
  "compilerOptions": {
    // ...
    "types": ["vite/client"]
  }
}
```

## 根目录下新建 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 3000,
  },
  test: {},
  plugins: [
    ...VitePluginNode({
      // NodeJs 原生请求适配器，支持'express', 'nest', 'koa' 和 'fastify',
      adapter: 'nest',
      // 项目入口文件
      appPath: './src/main',
      // 在项目入口文件中导出的名字
      exportName: 'appServer',
      // 编译方式: esbuild 和 swc, 默认 esbuild. 但esbuild 不支持 'emitDecoratorMetadata'
      tsCompiler: 'swc',
    }),
  ],
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
    include: ['./src/**/*.ts'],
  },
});
```

## 修改 main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开发环境下使用下面导出的 appServer 变量，生产环境下 / 打包好的代码中直接使用 app 上的 listen 方法
  if (import.meta.env.PROD) await app.listen(3000);
  return app;
}

export const appServer = bootstrap(); // 注意这里导出的变量名与 vite.config.ts 中 exportName 字段相同
```
