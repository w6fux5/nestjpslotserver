import { BadRequestException } from '@nestjs/common';

export class UseBadRequestException extends BadRequestException {
  constructor(reason: string, error?: string) {
    super(`error.${reason}`, error);
  }
}
