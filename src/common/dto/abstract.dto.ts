import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  id: Uuid;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
