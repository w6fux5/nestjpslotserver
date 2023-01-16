import { ForbiddenException } from '@nestjs/common';

export class UseForbiddenException extends ForbiddenException {
  constructor(reason: string, error?: string) {
    super(`error.${reason}`, error);
  }
}
