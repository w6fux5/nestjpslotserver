import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '@/shared/shared.module';

import { ormConfig, ormConfigProd } from '@/config';
import { UserModule } from '@features/user/user.module';
import { AuthModule } from '@features/auth/auth.module';
import { EgmModule } from '@/features/egm/egm.module';
import { AccessModule } from '@features/access/access.module';
import { ActionModule } from './features/action/action.module';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    AccessModule,
    UserModule,
    EgmModule,
    ActionModule,

    ConfigModule.forRoot({
      isGlobal: true,
      // load: [ormConfig],
      // expandVariables: true,
      envFilePath: `.${process.env.NODE_ENV ?? ''}.env`,
    }),

    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
