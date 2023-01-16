import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // 將 type 轉成 number
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // 將 type 轉成 number
  offset?: number;
}
