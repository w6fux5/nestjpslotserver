import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = () => {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const token = request.headers?.authorization?.split(' ')?.[1];
    const user = request?.user;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return { user, token };
  })();
};

export const CurrentAccess = () => {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const access = request?.user;

    if (access?.[Symbol.for('isPublic')]) {
      return;
    }

    return access;
  })();
};
