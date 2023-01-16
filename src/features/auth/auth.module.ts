import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '@/shared/services/api-config.service';

import { UserModule } from '@features/user/user.module';

import { AuthController } from '@features/auth/auth.controller';
import { AuthService } from '@features/auth/auth.service';
import { AccessModule } from '../access/access.module';

import {
  AdminStrategy,
  ClientJwtStrategy,
  PublicStrategy,
} from '@/features/auth/common';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AccessModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientJwtStrategy, PublicStrategy, AdminStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
