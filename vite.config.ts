import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 8888,
  },
  plugins: [
    ...VitePluginNode({
      // NodeJs 原生请求适配器，支持 'express', 'nest', 'koa' 和 'fastify',
      adapter: 'nest',
      // 项目入口文件
      appPath: './src/main',
      // 在项目入口文件中导出的名字
      exportName: 'appServer',
      // 编译方式: esbuild 和 swc, 默认 esbuild. 但 esbuild 不支持 'emitDecoratorMetadata'
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
    include: ['src/**/*.ts'],
  },
});
