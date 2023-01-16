import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionService } from '@features/action/action.service';
import { ActionController } from '@features/action/action.controller';
import { ActionEntity } from '@features/action/entities';
import { AccessModule } from '@features/access/access.module';
import { EgmModule } from '@features/egm/egm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActionEntity]),
    forwardRef(() => EgmModule),
    forwardRef(() => AccessModule),
  ],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
