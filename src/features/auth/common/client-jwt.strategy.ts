import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '@/constants';
import { UseUnauthorizedException } from '@/exceptions';
import { ApiConfigService } from '@/shared/services';

import { AccessService } from '@features/access/access.service';
import { AccessEntity } from '@/features/access/entities';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(
    private configService: ApiConfigService,

    @Inject(forwardRef(() => AccessService))
    private accessService: AccessService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    accessId: Uuid;
    type: TokenType;
  }): Promise<AccessEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UseUnauthorizedException('token_type');
    }
    const user = await this.accessService.findOne({
      id: args.accessId as never,
    });

    if (!user) {
      throw new UseUnauthorizedException('token_failed');
    }

    return user;
  }
}
