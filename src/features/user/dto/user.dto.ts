import { AbstractDto } from '@/common/dto/abstract.dto';
import { RoleType } from '@/constants';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@features/user/entities';

export class UserDto extends AbstractDto {
  @ApiProperty({ example: 'mike' })
  account: string;

  @ApiProperty({ enum: RoleType })
  role: RoleType;

  constructor(user: UserEntity) {
    super(user);
    this.account = user.account;
    this.role = user.role;
  }
}
