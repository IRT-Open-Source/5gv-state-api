import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AggregatorModule } from './aggregator/aggregator.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheStateModule } from './cache-state/cache-state.module';
import { MessengerService } from './messenger/messenger.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://5gv-state-db:27017', {
      useNewUrlParser: true,
      user: 'root',
      pass: 'admin',
      dbName: '5gv-state-db',
      useUnifiedTopology: true,
    }),
    AggregatorModule,
    CacheStateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
