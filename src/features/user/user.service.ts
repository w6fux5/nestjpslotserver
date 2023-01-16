import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';

import { UseNotFoundException } from '@/exceptions';

import { RegisterDto } from '@features/auth/dto';

import { UserEntity } from '@features/user/entities';
import { UpdateUserDto } from '@features/user/dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    const user = this.userRepo.create(registerDto);
    return await this.userRepo.save(user);
  }

  findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return paginate(query, this.userRepo, {
      select: ['id', 'account', 'role', 'createdAt', 'updatedAt'],
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      nullSort: 'last',
      filterableColumns: {
        id: [FilterOperator.EQ],
        account: [FilterOperator.EQ],
        role: [FilterOperator.EQ],
        createdAt: [
          FilterOperator.LTE,
          FilterOperator.GTE,
          FilterOperator.BTW,
          FilterOperator.EQ,
        ],
      },
    });
  }

  async findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const result = await this.userRepo.findOneBy(findData);

    if (!result) {
      throw new UseNotFoundException('user');
    }

    return result;
  }

  async update(id: Uuid, updateUserDto: UpdateUserDto) {
    const userEntity = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });

    if (!userEntity) {
      throw new UseNotFoundException('user');
    }

    return await this.userRepo.save(userEntity);
  }

  async remove(id: Uuid): Promise<any> {
    const userEntity = await this.findOne({ id });

    if (!userEntity) {
      throw new UseNotFoundException('user');
    }

    return await this.userRepo.remove(userEntity);
  }
}
