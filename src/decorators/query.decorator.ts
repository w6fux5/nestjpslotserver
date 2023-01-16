import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginateQueryOptions = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: '當前頁數',
      example: 'page=1',
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      description: '每頁有幾筆數據',
      example: 'limit=10',
    }),

    ApiQuery({
      name: 'sortBy',
      required: false,
      description: '排序',
      example: 'sortBy=ip:ASC',
    }),

    ApiQuery({
      name: 'filter',
      required: false,
      description: '過濾',
      example: 'filter.createdAt=$btw:2020-01-01:00:00:00,2023-01-13:08:33:16',
    }),
  );
};
