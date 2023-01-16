import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '@/common/dto/abstract.dto';
import { EgmEntity } from '../entities/egm.entity';

export type EgmDtoOptions = Partial<{
  isPlaying: boolean;
  whoIsIn: Uuid;
}>;

export class EgmDto extends AbstractDto {
  @ApiProperty({ description: 'egm ip', example: '192.168.10.101' })
  ip: string;

  @ApiProperty({ description: 'egm 廠牌', example: 'sammy' })
  brand: string;

  @ApiProperty({ description: 'egm 平台點數和機台代幣的比值', example: 200 })
  rate: number;

  @ApiProperty({
    description: '視訊的串流地址,要對應 ip',
    example: 'webrtc://192.168.10.121/game/101',
  })
  stream_url: string;

  @ApiProperty({ description: 'egm 型號', example: '拳王' })
  model: string;

  @ApiPropertyOptional()
  isPlaying?: boolean;

  @ApiPropertyOptional()
  whoIsIn?: Uuid;

  constructor(egm: EgmEntity, options?: EgmDtoOptions) {
    super(egm);
    this.ip = egm.ip;
    this.brand = egm.brand;
    this.rate = egm.rate;
    this.stream_url = egm.stream_url;
    this.model = egm.model;

    this.isPlaying = options?.isPlaying;
    this.whoIsIn = options?.whoIsIn;
  }
}
