import { ApiProperty } from '@nestjs/swagger';
import { PageLinksDto } from './page-links-dto';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  @ApiProperty()
  readonly links: PageLinksDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
