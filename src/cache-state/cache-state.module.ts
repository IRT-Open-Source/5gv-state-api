import { Module } from '@nestjs/common';
import { CacheStateController } from './cache-state.controller';
import { CacheStateService } from './cache-state.service';
import { MediaItemSchema } from './schemas/media-item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamSchema } from './schemas/stream.schema';
import { MessengerService } from '../messenger/messenger.service';
import { CacheStateGateway } from './cache-state.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MediaItem', schema: MediaItemSchema },
      { name: 'Stream', schema: StreamSchema },
    ]),
  ],
  controllers: [CacheStateController],
  providers: [CacheStateService, MessengerService, CacheStateGateway],
})
export class CacheStateModule {}
