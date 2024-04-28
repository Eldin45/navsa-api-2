import { Test, TestingModule } from '@nestjs/testing';
import { OfftakeService } from './offtake.service';

describe('OfftakeService', () => {
  let service: OfftakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfftakeService],
    }).compile();

    service = module.get<OfftakeService>(OfftakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
