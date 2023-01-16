import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '@/common/utils';
import { TokenType } from '@/constants';

import { UseNotFoundException } from '@/exceptions';

import { UserEntity } from '@features/user/entities/user.entity';
import { UserService } from '@features/user/user.service';

import { UserLoginDto } from './dto/login.dto';
import { TokenPayloadDto } from './dto/tokenPayloadDto';

import type { RoleType } from '@/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createBackstageToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    const token = await this.jwtService.signAsync({
      userId: data.userId,
      type: TokenType.ADMIN_TOKEN,
      role: data.role,
    });

    const tokenPayload = this.decodeToken(token);

    return new TokenPayloadDto(tokenPayload);
  }

  async createAccessToken(data: {
    member: string;
    ticket: string;
    accessId: Uuid;
  }): Promise<TokenPayloadDto> {
    const token = await this.jwtService.signAsync({
      member: data.member,
      ticket: data.ticket,
      type: TokenType.ACCESS_TOKEN,
      accessId: data.accessId,
    });

    const tokenPayload = this.decodeToken(token);

    return new TokenPayloadDto(tokenPayload);
  }

  decodeToken(token: string) {
    const { exp } = this.jwtService.decode(token) as any;

    const tokenPayload = { accessToken: token, expiresIn: exp };
    return tokenPayload;
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      account: userLoginDto.account,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UseNotFoundException('user');
    }

    return user!;
  }
}
