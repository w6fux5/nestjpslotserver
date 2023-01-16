import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UseUnauthorizedException } from '@/exceptions';
import { RoleType, TokenType } from '@/constants';
import { ApiConfigService } from '@/shared/services';

import type { UserEntity } from '@features/user/entities';
import { UserService } from '@features/user/user.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    userId: Uuid;
    role: RoleType;
    type: TokenType;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ADMIN_TOKEN) {
      throw new UseUnauthorizedException('token_type');
    }

    const user = await this.userService.findOne({
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UseUnauthorizedException('token_failed');
    }

    return user;
  }
}
