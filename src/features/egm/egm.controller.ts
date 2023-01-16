import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { Auth, PaginateQueryOptions, UUIDParam } from '@/decorators';
import { RoleType } from '@/constants';

import { EgmService } from '@features/egm/egm.service';
import { EgmEntity } from '@features/egm/entities';
import { UpdateEgmDto, EgmDto, CreateEgmDto } from '@features/egm/dto';
import { PageDto } from '@/common/dto/page.dto';
import { ActionService } from '../action/action.service';

@ApiTags('[後台/前台] egm')
@Controller('egm')
export class EgmController {
  constructor(
    private egmService: EgmService,
    private actionService: ActionService,
  ) {}

  /*=============================================
  =                           前台            =
  =============================================*/
  @Version('1')
  @Get('client')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PageDto<EgmDto>, description: '客戶端獲取 EGM list' })
  @Auth('client')
  @PaginateQueryOptions()
  findAllWithClient(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<EgmDto>> {
    return this.egmService.findAll(query);
  }
  /*=====  End of 前台  ======*/

  /*=============================================
=                      後台                 =
=============================================*/
  @Post()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EgmDto, description: 'create new egm' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  async create(@Body() createEgmDto: CreateEgmDto): Promise<EgmEntity> {
    return await this.egmService.create(createEgmDto);
  }

  @Get()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PageDto<EgmDto>, description: 'get all egm' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  @PaginateQueryOptions()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<EgmDto>> {
    return this.egmService.findAll(query);
  }

  @Get(':id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EgmDto, description: 'get single egm' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  async findOne(@UUIDParam('id') id: Uuid): Promise<EgmDto> {
    return await this.egmService.findOneById(id);
  }

  @Patch(':id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EgmDto, description: 'update egm' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateEgmDto: UpdateEgmDto,
  ): Promise<EgmEntity> {
    return await this.egmService.update(id, updateEgmDto);
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: EgmDto, description: 'delete egm' })
  async remove(@UUIDParam('id') id: Uuid): Promise<EgmEntity> {
    return await this.egmService.remove(id);
  }
  /*=====  End of 後台    ======*/
}
