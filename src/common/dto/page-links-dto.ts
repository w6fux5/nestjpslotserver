import { ApiProperty } from '@nestjs/swagger';

export class PageLinksDto {
  @ApiProperty({
    description: '第一頁',
    example: 'http://localhost:5000/api/v1/egm?page=1&limit=1&sortBy=ip:ASC',
  })
  readonly first: string;

  @ApiProperty({
    description: '上一頁',
    example: 'http://localhost:5000/api/v1/egm?page=1&limit=1&sortBy=ip:ASC',
  })
  readonly previous: string;

  @ApiProperty({
    description: '當前頁',
    example: 'http://localhost:5000/api/v1/egm?page=2&limit=1&sortBy=ip:ASC',
  })
  readonly current: string;

  @ApiProperty({
    description: '下一頁',
    example: 'http://localhost:5000/api/v1/egm?page=3&limit=1&sortBy=ip:ASC',
  })
  readonly next: string;

  @ApiProperty({
    description: '最後一頁',
    example: 'http://localhost:5000/api/v1/egm?page=6&limit=1&sortBy=ip:ASC',
  })
  readonly last: string;
}
