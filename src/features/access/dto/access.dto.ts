import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '@/common/dto';

import { AccessEntity } from '@features/access/entities';

export type AccessDtoOptions = Partial<{
  isPlaying: boolean;
  egmIn: Uuid;
}>;

export class AccessDto extends AbstractDto {
  @ApiProperty()
  member: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  ticket: string;

  @ApiProperty({ default: 1, description: '1 => Login, 2 => Logout' })
  type: number;

  @ApiPropertyOptional({ description: '是否在遊戲中' })
  isPlaying?: boolean;

  @ApiPropertyOptional({ description: '在哪一台Egm' })
  egmIn?: Uuid;

  constructor(access: AccessEntity, options?: AccessDtoOptions) {
    super(access);
    this.member = access.member;
    this.point = access.point;
    this.type = access.type;
    this.ticket = access.ticket;

    this.isPlaying = options?.isPlaying;
    this.egmIn = options?.egmIn;
  }
}
