import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@features/auth/auth.module';

import { AccessEntity } from '@features/access/entities';
import { AccessService } from '@features/access/access.service';
import { AccessController } from '@features/access/access.controller';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => ActionModule),
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
