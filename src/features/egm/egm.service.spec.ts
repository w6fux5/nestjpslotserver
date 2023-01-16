import { Test, TestingModule } from '@nestjs/testing';
import { EgmService } from './egm.service';

describe('EgmService', () => {
  let service: EgmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EgmService],
    }).compile();

    service = module.get<EgmService>(EgmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
