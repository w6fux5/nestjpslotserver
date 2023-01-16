import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @ApiProperty({ example: 'mike' })
  readonly account: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  readonly password: string;
}
