import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

import { middleware as expressCtx } from 'express-ctx';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import { bold } from 'console-log-colors';

import { setupSwagger } from '@/config';

import { SharedModule } from '@/shared/shared.module';
import { ApiConfigService } from '@/shared/services/api-config.service';

// import { HttpExceptionFilter } from '@/filters/bad-request.filter';
import { QueryFailedFilter, UnauthorizedExceptionFilter } from '@/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  app.setGlobalPrefix('/api');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.use(expressCtx);
  app.enableVersioning();

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    // new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
    // new UnauthorizedExceptionFilter(reflector),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  await app.listen(5000);

  if (process.env.NODE_ENV === 'production') {
    console.log(bold.cyan.bgRed.underline('production'));
  } else {
    console.log(
      bold.cyan.bgBlue.underline(process.env.NODE_ENV || 'Unknow ENV'),
    );
  }

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}
bootstrap();
