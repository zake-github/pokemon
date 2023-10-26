import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Session,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

// 守卫在中间件之后拦截器管道之前
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private Reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const admin = this.Reflector.get<string[]>('token', context.getHandler());
    // let res = false;
    const req = context.switchToHttp().getRequest<Request>();
    const cookie = req.headers.cookie;
    if (cookie) {
      const token = cookie.split('=')[1];
      console.log(token);
    }
    // s%3AbraXsxm4dFEYF2F5xvd_nBj3z5mYtXPV.Q81tFNMCC71rQZERRsVRYh68b4BetkfKPwE4wb5rG0Y
    // if (admin instanceof Array && role) {
    //   console.log('admin111', admin)
    //   res = (admin as Array<string>).includes(role.toString());
    // }
    // return res
    return true;
  }
}
