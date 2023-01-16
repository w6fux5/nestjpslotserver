import { RoleType } from '@/constants';
import { UseDto } from '@/decorators/use-dto.decorator';
import { Column, Entity } from 'typeorm';
import { UserDto } from '@features/user/dto/user.dto';
import { AbstractEntity } from '@/common/abstract.entity';

@Entity('user')
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column('text', { unique: true })
  account: string;

  @Column('text')
  password: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;
}
