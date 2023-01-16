import { UnauthorizedException } from '@nestjs/common';

export class UseUnauthorizedException extends UnauthorizedException {
  constructor(field: string, error?: string) {
    super(`error.${field}`, error);
  }
}
