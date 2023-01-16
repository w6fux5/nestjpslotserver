import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UseUnauthorizedException } from '@/exceptions';
import { Reflector } from '@nestjs/core';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = new UseUnauthorizedException('invalid_token').message;

    response.json({
      statusCode: 401,
      message,
      error: 'Unauthorized',
    });
  }
}
