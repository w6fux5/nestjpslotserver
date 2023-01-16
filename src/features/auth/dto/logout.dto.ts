import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserLogoutDto {
  @IsUUID()
  @ApiProperty({ description: 'User ID' })
  readonly id: Uuid;
}
