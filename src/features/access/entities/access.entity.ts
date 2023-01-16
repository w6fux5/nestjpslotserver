import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/common/abstract.entity';
import { UseDto } from '@/decorators';
import { ColumnNumericTransformer } from '@/common/helper/columnTransformer';

import { AccessDto, AccessDtoOptions } from '@features/access/dto';
import { ActionEntity } from '@features/action/entities';

@Entity('access')
@UseDto(AccessDto)
export class AccessEntity extends AbstractEntity<AccessDto, AccessDtoOptions> {
  @Column('text')
  member: string;

  @Column()
  token: string;

  @Column()
  ticket: string;

  @Column('decimal', {
    precision: 11,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
  })
  point: number;

  @Column({ type: 'int', default: 1 })
  type: number;

  @OneToMany(() => ActionEntity, (actionEntity) => actionEntity.access)
  actions: ActionEntity[];
}
