import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UseNotFoundException } from '@/exceptions';

import { CreateEgmDto, EgmDto, UpdateEgmDto } from '@features/egm/dto';
import { EgmEntity } from '@features/egm/entities';
import { ActionService } from '@features/action/action.service';

@Injectable()
export class EgmService {
  constructor(
    @InjectRepository(EgmEntity)
    private egmRepo: Repository<EgmEntity>,

    @Inject(forwardRef(() => ActionService))
    private actionService: ActionService,
  ) {}

  async create(createEgmDto: CreateEgmDto): Promise<EgmEntity> {
    const egm = this.egmRepo.create(createEgmDto);
    await this.egmRepo.save(egm);
    return egm;
  }

  async findOne(findData: FindOptionsWhere<EgmEntity>): Promise<EgmEntity> {
    const egmEntity = await this.egmRepo.findOneBy(findData);

    if (!egmEntity) {
      throw new UseNotFoundException('egm');
    }

    return egmEntity;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<EgmDto>> {
    const queryBuilder = this.egmRepo.createQueryBuilder('egm');

    queryBuilder
      .leftJoinAndSelect('egm.actions', 'action')
      .leftJoin('egm.actions', 'next', 'action.createdAt < next.createdAt')
      .where('next.id IS NULL');

    const list = await paginate(query, queryBuilder, queryConfig);

    const getIsPlayingList = await Promise.all(
      list.data.map(async (el) => {
        const egmDto = await this.findOneById(el.id);
        return egmDto;
      }),
    );

    const result: Paginated<EgmDto> = list;

    return { ...result, data: getIsPlayingList };
  }

  async findOneById(id: Uuid): Promise<EgmDto> {
    const egmEntity = await this.egmRepo
      .createQueryBuilder('egm')
      .where('egm.id = :id', { id })
      .getOne();

    if (!egmEntity) {
      throw new UseNotFoundException('egm');
    }

    const isPlaying = await this.actionService.checkIsPlaying(
      egmEntity.id,
      'egm',
    );

    const actionEntity = await this.actionService.whoIsIn({ egmId: id });
    const whoIsIn = actionEntity?.id;

    return egmEntity.toDto({ isPlaying, whoIsIn });
  }

  async update(id: Uuid, updateEgmDto: UpdateEgmDto) {
    const egmEntity = await this.egmRepo.preload({
      id,
      ...updateEgmDto,
    });

    if (!egmEntity) {
      throw new UseNotFoundException('egm');
    }

    return await this.egmRepo.save(egmEntity);
  }

  async remove(id: Uuid) {
    const egmEntity = await this.findOne({ id });
    return await this.egmRepo.remove(egmEntity);
  }
}

const queryConfig: PaginateConfig<EgmEntity> = {
  // relations: ['actions'],
  sortableColumns: ['ip', 'createdAt', 'rate'],
  defaultLimit: 10,
  nullSort: 'last',
  filterableColumns: {
    id: [FilterOperator.EQ],
    ip: [FilterOperator.EQ],
    brand: [FilterOperator.EQ],
    model: [FilterOperator.EQ],
    stream_url: [FilterOperator.EQ],
    rate: [
      FilterOperator.GTE,
      FilterOperator.LTE,
      FilterOperator.BTW,
      FilterOperator.EQ,
    ],
    createdAt: [
      FilterOperator.LTE,
      FilterOperator.GTE,
      FilterOperator.BTW,
      FilterOperator.EQ,
    ],
  },
};

// const egmQueryBuilder = this.egmRepo.createQueryBuilder('egm');

// egmQueryBuilder.leftJoinAndSelect('egm.actions', 'action');
// .leftJoinAndMapOne('egm.isPlaying', 'egm.actions', 'isPlaying')

// const subQuery = egmQueryBuilder.connection
//   .createQueryBuilder(ActionEntity, 'action')
//   .limit(1);

// egmQueryBuilder.leftJoinAndSelect(
//   'egm.actions',
//   'action',
//   `action.id IN (${subQuery.select('id').getQuery()})`,
// );
