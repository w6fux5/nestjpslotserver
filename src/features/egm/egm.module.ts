import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EgmService } from '@features/egm/egm.service';
import { EgmController } from '@features/egm/egm.controller';
import { EgmEntity } from '@features/egm/entities/egm.entity';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EgmEntity]),
    forwardRef(() => ActionModule),
  ],
  controllers: [EgmController],
  providers: [EgmService],
  exports: [EgmService],
})
export class EgmModule {}
