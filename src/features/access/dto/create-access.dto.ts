import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  member: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticket: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty()
  // token?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  point: number;

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty({ default: 1, description: '1 => Login, 2 => Logout' })
  // type: number;
}
