import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'; // session
import * as cors from 'cors'; // 跨域
import { Reflector } from "@nestjs/core";
import { RoleGuard } from './guard/role.guard'; // 守卫全局引入
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { response } from './common/response'; //
import { Request, Response, NextFunction } from 'express';
import { apis } from './config';
import { join } from 'path';
const { createProxyMiddleware } = require('http-proxy-middleware');

// 全局拦截（中间件）
function middlewareAll(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);
  const url = req.originalUrl.split('?')[0];
  if (url.includes('/play/resources')) {
    next();
    return;
  }

  const regs = apis.map(v => new RegExp(`^${v}$`))
  let isPass = false;
  regs.forEach(reg => {
    if (reg.test(url)) {
      isPass = true;
    }
  })
  if (isPass) {
    next();
  } else {
    res.send({
      code: 404,
      message: '访问的接口不存在',
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.use(
    '/play/resources',
    createProxyMiddleware({
      target: `https://www.pokemon.cn`,
      logLevel: 'debug',
      changeOrigin: true,
    })
  );
  app.use(
    session({
      secret: 'zs', // 生成服务端session签名 加盐
      name: 'token', // 生成客户端cookie名字默认connect sid
      cookie: {
        httpOnly: true,
        maxAge: 50000,
      }, // 设置返回到前端key属性，默认值为{path: '/', httpOnly: true,secure: false, maxAge: null}
      rolling: true, // 每次请求强行设置cookie, 重置cookie过期时间（默认false）
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'pokedex'),
    {
      prefix: '/img/pm',
    });

  app.use(middlewareAll); // 拦截
  // 全局守卫
  app.useGlobalGuards(new RoleGuard(new Reflector()))
  app.useGlobalInterceptors(new response());
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(3000);
}
bootstrap();
