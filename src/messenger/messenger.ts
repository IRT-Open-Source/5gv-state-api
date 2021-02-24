import STAN = require('node-nats-streaming');
import { Logger, Injectable, Provider } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

export class Messenger {
  private readonly MS_CLUSTER_NAME = 'test-cluster';
  private static instance: Messenger;
  static DISCONNECTED = 0;
  static CONNECTED = 1;
  private logger = new Logger(Messenger.name);
  private stan: STAN.Stan;
  private clientId: string = null;

  onConnectionChange = new BehaviorSubject<number>(Messenger.DISCONNECTED);

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  static getInstance(clientId: string): Messenger {
    if (!Messenger.instance) {
      Messenger.instance = new Messenger(clientId);
      Messenger.instance
        .connect()
        .then(() => Messenger.instance.onConnectionChange.next(this.CONNECTED));
    }
    return Messenger.instance;
  }

  private async connect() {
    return new Promise(resolve => {
      this.stan = STAN.connect(this.MS_CLUSTER_NAME, this.clientId, {
        url: 'nats://5gv-message-broker:4222',
      });
      this.stan.on('connect', () => {
        this.logger.log(
          `Connected to 5gv-message-broker service: cluster'${this.MS_CLUSTER_NAME}', client-ID ${this.clientId}`,
        );
        resolve();
      });
    });
  }

  publish(channel: string, message: string) {
    return new Promise((resolve, reject) => {
      this.stan.publish(channel, message, (error, guid) => {
        if (error) {
          this.logger.error(
            `Publishing [${guid}]: ${message} failed due to: ${error}`,
          );
          reject();
        } else {
          this.logger.log(`Published [${guid}]: ${message} `);
          resolve();
        }
      });
    });
  }
}
