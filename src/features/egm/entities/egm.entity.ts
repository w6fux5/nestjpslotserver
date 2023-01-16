import { AbstractEntity } from '@/common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { EgmDto, EgmDtoOptions } from '@features/egm/dto/egm.dto';
import { ColumnNumericTransformer } from '@/common/helper/columnTransformer';
import { ActionEntity } from '@/features/action/entities';
import { UseDto } from '@/decorators';

@Entity('egm')
@UseDto(EgmDto)
export class EgmEntity extends AbstractEntity<EgmDto, EgmDtoOptions> {
  @Column('text', {
    unique: true,
  })
  ip: string;

  @Column('text')
  brand: string;

  @Column('decimal', {
    precision: 11,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
  })
  rate: number;

  @Column('text', {
    unique: true,
  })
  stream_url: string;

  @Column('text')
  model: string;

  @OneToMany(() => ActionEntity, (actionEntity) => actionEntity.egm)
  actions: ActionEntity[];
}
