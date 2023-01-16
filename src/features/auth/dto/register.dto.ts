import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { Trim } from '@/decorators/transform.decorators';

// @ApiProperty({
//   maxLength: 20,
//   description: 'Todo 的標題',
// })

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'mike' })
  readonly account: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  readonly password: string;
}
