import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '@/common/dto/abstract.dto';

export class ActionDto extends AbstractDto {
  @ApiProperty({ nullable: true })
  egm: string;

  @ApiProperty({ nullable: true })
  access: string;

  @ApiProperty()
  type: number;
}
