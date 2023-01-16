import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateEgmDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'egm ip', example: '192.168.10.101' })
  readonly ip: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'egm 廠牌', example: 'sammy' })
  readonly brand: string;

  @Max(9999999.99)
  @Min(0.0001)
  @ApiProperty({ description: 'egm 平台點數和機台代幣的比值', example: 200 })
  readonly rate: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '視訊的串流地址,要對應 ip',
    example: 'webrtc://192.168.10.121/game/101',
  })
  readonly stream_url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'egm 型號', example: '拳王' })
  readonly model: string;
}
