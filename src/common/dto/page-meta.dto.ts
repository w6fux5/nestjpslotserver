import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty({ description: '每一頁有幾筆數據' })
  readonly itemsPerPage: number;

  @ApiProperty({ description: '總共有多少筆數據' })
  readonly totalItems: number;

  @ApiProperty({ description: '當前頁數' })
  readonly currentPage: number;

  @ApiProperty({ description: '總共有多少頁' })
  readonly totalPages: number;

  @ApiProperty({
    description: '目前的排序',
    example: '[["ip", "ASC"]]',
  })
  readonly sortBy: string;

  @ApiProperty({
    description: '$eq, $gt, $gte, $lt, $lte)',
    example: ' {rate:  $gte: 500}',
  })
  readonly filter: string;
}
