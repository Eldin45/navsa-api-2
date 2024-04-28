import { Module } from '@nestjs/common';
import { OfftakeController } from './offtake.controller';
import { OfftakeService } from './offtake.service';

@Module({
  controllers: [OfftakeController],
  providers: [OfftakeService]
})
export class OfftakeModule {}
