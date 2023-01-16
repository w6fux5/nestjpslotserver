import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { RoleType } from '@/constants';
import { Auth, UUIDParam, CurrentAccess } from '@/decorators';

import { ActionService } from '@features/action/action.service';
import { ActionEntity } from '@features/action/entities';
import { ActionDto } from '@features/action/dto';

@ApiTags('action')
@Controller('action')
export class ActionController {
  constructor(private actionService: ActionService) {}

  /*=============================================
  =                   前台                     =
  =============================================*/
  @Post('select-egm/:id')
  @Version('1')
  @Auth('client')
  selectEgm(
    @UUIDParam('id') egmId: Uuid,
    @CurrentAccess() { token: accessToken }: { token: string },
  ) {
    return this.actionService.enter({ egmId, accessToken });
  }

  @Post('leave-egm/:id')
  @Version('1')
  @Auth('client')
  leaveEgm(
    @UUIDParam('id') egmId: Uuid,
    @CurrentAccess() { token: accessToken }: { token: string },
  ) {
    return this.actionService.leave({ egmId, accessToken });
  }
  /*=====  End of 前台 ======*/

  /*=============================================
  =                    後台                     =
  =============================================*/

  @Get(':id')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ActionDto, description: 'get single action' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  async findOne(@UUIDParam('id') id: Uuid): Promise<ActionEntity> {
    console.log(id);
    return await this.actionService.findOneById(id);
  }

  @Get()
  @Version('1')
  @Auth('admin', [RoleType.ADMIN, RoleType.USER])
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ActionEntity>> {
    const result = await this.actionService.findAll(query);
    return result;
  }
  /*=====  End of 後台  ======*/

  //=================  backup ========//
  // @Post('check-egm/:id')
  // @Version('1')
  // async checkEgm(@UUIDParam('id') egmId: Uuid): Promise<boolean> {
  //   await this.egmService.findOneById(egmId);

  //   return this.actionService.checkIsPlaying(egmId, 'egm');
  // }

  // @Post('check-access/:id')
  // @Version('1')
  // async checkAccess(@UUIDParam('id') accessId: Uuid): Promise<boolean> {
  //   await this.accessService.findOne({ id: accessId });
  //   return this.actionService.checkIsPlaying(accessId, 'access');
  // }
}
