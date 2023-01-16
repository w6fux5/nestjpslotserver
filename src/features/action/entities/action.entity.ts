import { AbstractEntity } from '@/common/abstract.entity';
import { AccessEntity } from '@/features/access/entities';
import { EgmEntity } from '@/features/egm/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ActionDto } from '../dto';

@Entity('action')
export class ActionEntity extends AbstractEntity<ActionDto> {
  @Column()
  type: number;

  @ManyToOne(() => EgmEntity, (egmEntity) => egmEntity.actions)
  egm: EgmEntity;

  @ManyToOne(() => AccessEntity, (accessEntity) => accessEntity.actions)
  access: AccessEntity;
}
