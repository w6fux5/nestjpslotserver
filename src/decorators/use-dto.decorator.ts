import type { AbstractEntity } from '@/common/abstract.entity';
import type { AbstractDto } from '@/common/dto';
import type { Constructor } from '@/types';

export const UseDto = (
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator => {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
};
