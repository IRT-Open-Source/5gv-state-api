import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { CacheStateService } from './cache-state.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { AvailabilityUpdate } from './messages/availability-update.response';
import { Logger } from '@nestjs/common';
import { SingleItemAvailabilityUpdate } from './messages/single-item-availability.response';

@WebSocketGateway()
export class CacheStateGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  logger = new Logger(CacheStateGateway.name);

  @WebSocketServer() server: Server;

  constructor(private cacheState: CacheStateService) {}

  handleConnection(client: Client, ...args: any[]) {
    this.logger.log(`CONNECT: ${client.id}`);
  }

  handleDisconnect(client: Client) {
    this.logger.log(`DISCONNECT: ${client.id}`);
  }

  @SubscribeMessage('availability')
  handleAvailabilitySubscription(
    client: Client,
    payload: any,
  ): Subject<AvailabilityUpdate> {
    this.logger.log(`SUB: 'availability' by ${client.id}`);
    // Emit last state
    this.cacheState
      .getAvailability()
      .then((a) => this.server.emit('availability', a));
    return this.cacheState.availabilityChange;
  }

  @SubscribeMessage('single-item-availability')
  handleSignleItemAvailabilitySubscription(
    client: any,
    payload: any,
  ): Subject<SingleItemAvailabilityUpdate> {
    this.logger.log(`SUB: 'single-item-availability' by ${client.id}'`);
    // this.cacheState.singleItemAvailabilityChange.subscribe((msg) => {
    //   this.logger.verbose(`Emit ${JSON.stringify(msg)}`);
    // //   this.server.emit('single-item-availability', msg);
    // });
    // this.server.emit('single-item-availability', 'hi');
    return this.cacheState.singleItemAvailabilityChange;
  }
}
