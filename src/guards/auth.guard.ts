import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export type StrategyType = 'admin' | 'client' | 'public';

export const AuthGuard = (
  strategy: StrategyType,
  options?: Partial<{ public: boolean }>,
): Type<IAuthGuard> => {
  const strategies = [strategy];

  if (options?.public) {
    strategies.push('public');
  }

  return NestAuthGuard(strategies);
};
