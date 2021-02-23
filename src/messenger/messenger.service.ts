import { Injectable } from '@nestjs/common';
import { Messenger } from './messenger';

@Injectable()
export class MessengerService {
  private messenger: Messenger;

  constructor() {
    this.messenger = Messenger.getInstance('state-api');
  }

  publish(channel: string, message: string) {
    this.messenger.publish(channel, message);
  }
}
