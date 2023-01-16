import { NotFoundException } from '@nestjs/common';

export class UseNotFoundException extends NotFoundException {
  constructor(field: string, error?: string) {
    super(`error.${field}.not_found`, error);
  }
}
