import { UserDto } from '@/features/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './tokenPayloadDto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
