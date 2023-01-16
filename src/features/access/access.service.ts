import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuid } from 'uuid';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UseNotFoundException } from '@/exceptions';

import { AccessEntity } from '@features/access/entities';
import { CreateAccessDto } from '@features/access/dto';

import { AuthService } from '@features/auth/auth.service';
import { AccessPayloadDto } from '@features/auth/dto';
import { ActionService } from '@features/action/action.service';
import { AccessDto } from './dto/access.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private accessRepo: Repository<AccessEntity>,

    @Inject(forwardRef(() => ActionService))
    private actionService: ActionService,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(createAccessDto: CreateAccessDto): Promise<AccessEntity> {
    const access = this.accessRepo.create(createAccessDto);
    return await this.accessRepo.save(access);
  }

  async findOne(
    findData: FindOptionsWhere<AccessEntity>,
  ): Promise<AccessEntity> {
    const result = await this.accessRepo.findOneBy(findData);

    if (!result) {
      throw new UseNotFoundException(`access`);
    }

    return result;
  }

  async findOneById(id: Uuid): Promise<AccessDto> {
    const accessEntity = await this.accessRepo
      .createQueryBuilder('access')
      .where('access.id = :id', { id })
      .getOne();

    if (!accessEntity) {
      throw new UseNotFoundException('access');
    }

    const isPlaying = await this.actionService.checkIsPlaying(
      accessEntity.id,
      'access',
    );

    const egmEntity = await this.actionService.whichEgmIn({
      accessId: accessEntity.id,
    });

    const egmIn = egmEntity?.id;

    return accessEntity.toDto({ isPlaying, egmIn });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<AccessDto>> {
    const queryBuilder = this.accessRepo.createQueryBuilder('access');

    queryBuilder
      .leftJoinAndSelect('access.actions', 'action')
      .leftJoin('access.actions', 'next', 'action.createdAt < next.createdAt')
      .where('next.id IS NULL');

    const list = await paginate(query, queryBuilder, queryConfig);

    const getIsPlayingList = await Promise.all(
      list.data.map(async (el) => {
        const accessDto = await this.findOneById(el.id);
        return accessDto;
      }),
    );

    const result: Paginated<AccessDto> = list;

    return { ...result, data: getIsPlayingList };
  }

  async enterAccess(
    createAccessDto: CreateAccessDto,
  ): Promise<AccessPayloadDto> {
    const { member, ticket, point } = createAccessDto;

    const accessId = uuid() as Uuid;
    const tokenPayload = await this.authService.createAccessToken({
      member,
      ticket,
      accessId,
    });

    const accessData = {
      id: accessId,
      token: tokenPayload.accessToken,
      type: 1,
      member,
      ticket,
      point,
    };

    const accessEntity = await this.create(accessData);
    return new AccessPayloadDto(accessEntity.toDto(), tokenPayload);
  }

  async leaveAccess(id: Uuid): Promise<AccessPayloadDto> {
    const access = await this.findOne({ id });

    const { member, point, ticket, token } = access;

    const accessData = {
      member,
      point,
      ticket,
      token,
      type: 2,
    };

    const accessEntity = await this.create(accessData);

    const tokenPayload = this.authService.decodeToken(token);

    return new AccessPayloadDto(accessEntity.toDto(), tokenPayload);
  }

  async currentAccess(accessEntity: AccessEntity): Promise<AccessPayloadDto> {
    const tokenPayload = this.authService.decodeToken(accessEntity.token);
    const accessDto = await this.findOneById(accessEntity.id);
    return new AccessPayloadDto(accessDto, tokenPayload);
  }
}

const queryConfig: PaginateConfig<AccessEntity> = {
  sortableColumns: ['createdAt', 'type', 'point'],
  defaultSortBy: [['createdAt', 'DESC']],
  defaultLimit: 10,
  nullSort: 'last',
  filterableColumns: {
    id: [FilterOperator.EQ],
    member: [FilterOperator.EQ],
    token: [FilterOperator.EQ],
    ticket: [FilterOperator.EQ],
    type: [FilterOperator.EQ],
    point: [
      FilterOperator.EQ,
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.BTW,
    ],
    createdAt: [
      FilterOperator.EQ,
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.BTW,
    ],
  },
};

// const isPlaying = await this.actionService.checkIsPlaying(
//   accessEntity.id,
//   'access',
// );

// const egmEntity = await this.actionService.whichEgmIn({
//   accessId: accessEntity.id,
// });
// const egmIn = egmEntity?.id;

// const accessDto = accessEntity.toDto({ isPlaying, egmIn });
