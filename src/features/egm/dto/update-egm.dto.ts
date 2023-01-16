import { PartialType } from '@nestjs/swagger';
import { CreateEgmDto } from './create-egm.dto';

export class UpdateEgmDto extends PartialType(CreateEgmDto) {}
