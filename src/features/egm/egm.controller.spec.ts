import { Test, TestingModule } from '@nestjs/testing';
import { EgmController } from './egm.controller';
import { EgmService } from './egm.service';

describe('EgmController', () => {
  let controller: EgmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EgmController],
      providers: [EgmService],
    }).compile();

    controller = module.get<EgmController>(EgmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
