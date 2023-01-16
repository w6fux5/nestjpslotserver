import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UseNotFoundException } from '@/exceptions';

import { EgmService } from '@features/egm/egm.service';

import { CreateActionDto } from '@features/action/dto';
import { ActionEntity } from '@features/action/entities';
import { AccessService } from '@features/access/access.service';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { EgmEntity } from '../egm/entities';
import { AccessEntity } from '../access/entities/access.entity';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(ActionEntity)
    private actionRepo: Repository<ActionEntity>,

    @Inject(forwardRef(() => AccessService))
    private accessService: AccessService,

    @Inject(forwardRef(() => EgmService))
    private egmService: EgmService,
  ) {}

  create(createActionDto: CreateActionDto, actionData: any) {
    const actionEntity = this.actionRepo.create(createActionDto);
    actionEntity.access = actionData.access.id;
    actionEntity.egm = actionData.egm.id;
    return this.actionRepo.save(actionEntity);
  }

  async findOne(
    findData: FindOptionsWhere<ActionEntity>,
  ): Promise<ActionEntity> {
    const result = await this.actionRepo.findOneBy(findData);

    if (!result) {
      throw new UseNotFoundException(`action`);
    }

    return result;
  }

  findAll(query: PaginateQuery): Promise<Paginated<ActionEntity>> {
    const queryBuilder = this.actionRepo.createQueryBuilder('action');

    queryBuilder
      .leftJoin('action.egm', 'egm')
      .leftJoin('action.access', 'access')
      .addSelect(['egm.id', 'access.id']);

    return paginate(query, queryBuilder, queryConfig);
  }

  async checkIsPlaying(id: Uuid, payload: 'egm' | 'access'): Promise<boolean> {
    const action = await this.actionRepo
      .createQueryBuilder('action')
      .leftJoinAndSelect(`action.${payload}`, `${payload}`)
      .orderBy('action.createdAt', 'DESC')
      .where(`${payload}.id = :id`, { id })
      .getOne();

    const isPlaying = action?.type === 1;

    return isPlaying;
  }

  async findOneById(actionId: Uuid): Promise<ActionEntity> {
    const queryBuilder = this.actionRepo
      .createQueryBuilder('action')
      .leftJoin('action.egm', 'egm')
      .leftJoin('action.access', 'access')
      .addSelect(['egm.id', 'access.id'])
      .where('action.id = :id', { id: actionId });

    const actionEntity = await queryBuilder.getOne();

    if (!actionEntity) {
      throw new UseNotFoundException('action');
    }

    return actionEntity;
  }

  // access 在哪一台 egm
  async whichEgmIn({
    accessId,
  }: {
    accessId: Uuid;
  }): Promise<EgmEntity | undefined> {
    const queryBuilder = this.actionRepo.createQueryBuilder('action');

    queryBuilder
      .leftJoin('action.egm', 'egm')
      .leftJoin('action.access', 'access')
      .addSelect(['egm.id'])
      .addSelect(['access.id'])
      .andWhere(`access.id = :id`, {
        id: accessId,
      })
      .orderBy('action.createdAt', 'DESC');

    const actionEntity = await queryBuilder.getOne();

    if (actionEntity?.type === 1) {
      return actionEntity?.egm;
    }

    return undefined;
  }

  // 誰在這一台 egm
  async whoIsIn({ egmId }: { egmId: Uuid }): Promise<AccessEntity | undefined> {
    const queryBuilder = this.actionRepo.createQueryBuilder('action');

    queryBuilder
      .leftJoin('action.egm', 'egm')
      .leftJoin('action.access', 'access')
      .addSelect(['egm.id'])
      .addSelect(['access.id'])
      .andWhere(`egm.id = :id`, {
        id: egmId,
      })
      .orderBy('action.createdAt', 'DESC');

    const actionEntity = await queryBuilder.getOne();

    if (actionEntity?.type === 1) {
      return actionEntity?.access;
    }

    return undefined;
  }

  async enter({ egmId, accessToken }: { egmId: Uuid; accessToken: string }) {
    const access = await this.accessService.findOne({ token: accessToken });

    await this.allowSelectEgm({ egmId, accessId: access.id });

    const egm = await this.egmService.findOneById(egmId);

    const actionData = {
      access,
      egm,
    };

    return this.create({ type: 1 }, actionData);
  }

  async leave({ egmId, accessToken }: { egmId: Uuid; accessToken: string }) {
    const access = await this.accessService.findOne({ token: accessToken });
    const egm = await this.egmService.findOneById(egmId);

    await this.allowLeave({ accessId: access.id, egmId: egm.id });

    if (!access) {
      throw new UseNotFoundException('access');
    }

    const actionData = {
      access,
      egm,
    };

    return this.create({ type: 2 }, actionData);
  }

  async allowSelectEgm({ egmId, accessId }: { egmId: Uuid; accessId: Uuid }) {
    const accessIsPlaying = await this.checkIsPlaying(accessId, 'access');
    if (accessIsPlaying) {
      throw new ForbiddenException('access_is_playing');
    }

    const egmIsPlaying = await this.checkIsPlaying(egmId, 'egm');
    if (egmIsPlaying) {
      throw new ForbiddenException('egm_is_playing');
    }
  }

  async allowLeave({ egmId, accessId }: { egmId: Uuid; accessId: Uuid }) {
    const egmIsPlaying = await this.checkIsPlaying(egmId, 'egm');
    if (!egmIsPlaying) {
      throw new ForbiddenException('egm_not_playing');
    }

    const accessIsPlaying = await this.checkIsPlaying(accessId, 'access');
    if (!accessIsPlaying) {
      throw new ForbiddenException('access_not_playing');
    }

    const egm = await this.egmService.findOneById(egmId);
    if (accessId !== egm.whoIsIn) {
      throw new ForbiddenException('egm_access_incompatible');
    }
  }
}

const queryConfig: PaginateConfig<ActionEntity> = {
  sortableColumns: ['createdAt', 'type', 'egm', 'access'],
  defaultLimit: 10,
  nullSort: 'last',
  filterableColumns: {
    type: [FilterOperator.EQ],
    egm: [FilterOperator.EQ],
    access: [FilterOperator.EQ],

    createdAt: [
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.BTW,
      FilterOperator.EQ,
    ],
  },
};
