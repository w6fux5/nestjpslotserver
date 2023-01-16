import {
  Controller,
  Get,
  Delete,
  HttpStatus,
  HttpCode,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '@/constants';
import { Auth, PaginateQueryOptions, UUIDParam } from '@/decorators';

import { UserDto } from '@features/user/dto';
import { UserService } from '@features/user/user.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserEntity } from './entities';
import { PageDto } from '@/common/dto';

@ApiTags('[後台] user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PageDto<UserDto>, description: 'get all user' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  @PaginateQueryOptions()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return this.userService.findAll(query);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'delete user' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  async remove(@UUIDParam('id') id: Uuid) {
    const userEntity = await this.userService.remove(id);
    return userEntity;
  }
}
