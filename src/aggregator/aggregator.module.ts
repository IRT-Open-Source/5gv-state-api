import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AggregatorConfigSchema } from './schemas/aggregator-config.schema';
import { AggregatorController } from './aggregator.controller';
import { MessengerService } from 'src/messenger/messenger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AggregatorConfig', schema: AggregatorConfigSchema },
    ]),
  ],
  controllers: [AggregatorController],
  providers: [AggregatorService, MessengerService],
})
export class AggregatorModule {}
