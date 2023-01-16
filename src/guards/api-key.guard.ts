import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isApiKeyGuard = !!this.reflector.get('api-key', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (isApiKeyGuard) {
      return request.headers['api-key'] === 'g5?v?-=UAe@8qHXhKa@7hPe$udHv8unV';
    }

    return true;
  }
}
