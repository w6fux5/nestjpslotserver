import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSelf = !!this.reflector.get('isSelf', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (isSelf) {
      return request.params.id === request.user.id;
    }

    return true;
  }
}
