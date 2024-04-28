import { Test, TestingModule } from '@nestjs/testing';
import { OfftakeController } from './offtake.controller';

describe('OfftakeController', () => {
  let controller: OfftakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfftakeController],
    }).compile();

    controller = module.get<OfftakeController>(OfftakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
