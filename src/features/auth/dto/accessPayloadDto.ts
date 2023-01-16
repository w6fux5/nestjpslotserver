import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './tokenPayloadDto';
import { AccessDto } from '@features/access/dto';

export class AccessPayloadDto {
  @ApiProperty({ type: AccessDto })
  access: AccessDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(access: AccessDto, token: TokenPayloadDto) {
    this.access = access;
    this.token = token;
  }
}
