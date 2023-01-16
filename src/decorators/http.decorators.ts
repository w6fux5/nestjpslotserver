import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { RolesGuard } from '@/guards/roles.guard';
import { AuthUserInterceptor } from '@/interceptors/auth-user.interceptor';
import { PublicRoute } from './public-route.decorator';

import type { Type } from '@nestjs/common/interfaces';
import type { RoleType } from '@/constants';
import type { PipeTransform } from '@nestjs/common';
import { SelfGuard, IpGuard, AuthGuard, ApiKeyGuard } from '@/guards';
import type { StrategyType } from '@/guards';

export const Auth = (
  name: StrategyType,
  roles: RoleType[] = [],
  options?: Partial<{
    public: boolean;
    isSelf: boolean;
    internal: boolean;
    isAPiKey: boolean;
  }>,
): MethodDecorator => {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('isSelf', options?.isSelf),
    SetMetadata('internal', options?.internal),
    SetMetadata('api-key', options?.isAPiKey),
    UseGuards(
      AuthGuard(name, { public: isPublicRoute }),
      RolesGuard,
      SelfGuard,
      IpGuard,
      ApiKeyGuard,
    ),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
};

export const UUIDParam = (
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator => {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
};
