import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Version,
  Req,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Request } from 'express';

import { PageDto } from '@/common/dto';
import { RoleType } from '@/constants';
import {
  Auth,
  CurrentAccess,
  PaginateQueryOptions,
  UUIDParam,
} from '@/decorators';

import { AccessService } from '@features/access/access.service';
import { CreateAccessDto, AccessDto } from '@features/access/dto';
import { AccessEntity } from '@features/access/entities';

import { AccessPayloadDto } from '@features/auth/dto';
import { AuthService } from '@features/auth/auth.service';
import { BadRequestException } from '@nestjs/common';
import { UseBadRequestException } from '../../exceptions/use-bad-request.exception';

@Controller('access')
@ApiTags('[前台/後台] access')
export class AccessController {
  constructor(
    private accessService: AccessService,
    private authService: AuthService,
  ) {}

  /*=============================================
  =                      前台                 =
  =============================================*/
  @Post('enter')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessPayloadDto, description: 'enter access' })
  async enterAccess(
    @Req() request: Request,
    @Body() createAccessDto: CreateAccessDto,
  ): Promise<AccessPayloadDto> {
    const token = request.headers?.authorization?.replace('Bearer ', '');

    if (token) {
      throw new UseBadRequestException('header_old_token');
    }

    const accessPayload = await this.accessService.enterAccess(createAccessDto);
    return accessPayload;
  }

  @Post('leave/:id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessDto, description: 'leave access' })
  @ApiForbiddenResponse({ description: 'id 和 header token 不符合' })
  @Auth('client', [], { isSelf: true })
  async leaveAccess(
    @UUIDParam('id') id: Uuid,
    @CurrentAccess() access: AccessEntity,
  ) {
    await this.accessService.findOne({
      token: access.token,
    });

    const accessPayload = await this.accessService.leaveAccess(id);
    return accessPayload;
  }

  @Get('me')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessPayloadDto, description: 'current access info' })
  @Auth('client', [])
  async getCurrentAccess(
    @CurrentAccess()
    access: AccessEntity,
  ): Promise<AccessPayloadDto> {
    return await this.accessService.currentAccess(access);
  }
  /*=====  End of 前台  ======*/

  /*=============================================
  =                   後台                      =
  =============================================*/
  @Get()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: PageDto<AccessDto>,
    description: '後台獲取 Access 資訊',
  })
  @PaginateQueryOptions()
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<AccessDto>> {
    return this.accessService.findAll(query);
  }

  @Get('/:id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessDto, description: 'find single access' })
  @Auth('admin', [RoleType.ADMIN, RoleType.USER])
  async findOneById(@UUIDParam('id') id: Uuid): Promise<AccessDto> {
    return await this.accessService.findOneById(id);
  }
  /*=====  End of 後台  ======*/
}
