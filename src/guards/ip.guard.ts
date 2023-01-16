import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as requestIp from 'request-ip';

const WHITE_LIST = ['::1', '(^192.168.)', '127.0.0.1', '::ffff:192.168.10.55'];

@Injectable()
export class IpGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isIpGuard = !!this.reflector.get('internal', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (isIpGuard) {
      const clientIp = requestIp.getClientIp(request) || '';
      console.log(clientIp, 'client ip');
      const isLocal = /^::1/.test(clientIp) || /^192.168.10/.test(clientIp);
      const isWhiteList = WHITE_LIST.includes(clientIp);
      return isLocal || isWhiteList;
    }

    return true;
  }
}
