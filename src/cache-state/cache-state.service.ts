import { Injectable, Logger } from '@nestjs/common';
import { CacheStateConfigItemDto } from './dto/cache-state-config-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StreamInterface } from './interfaces/stream.interface';
import { Promise } from 'bluebird';
import md5 = require('md5');
import { MessengerService } from '../messenger/messenger.service';
import * as routes from './routes.json';
import { StreamInfoDto } from './dto/stream-info.dto';
import { Subject, BehaviorSubject } from 'rxjs';
import { AvailabilityUpdate } from './messages/availability-update.response';
import { SingleItemAvailabilityUpdate } from './messages/single-item-availability.response';
import { AvailabilityDto } from './dto/availability.dto';
import { SingleItemAvailabilityDto } from './dto/single-item-availability.dto';

@Injectable()
export class CacheStateService {
  logger = new Logger(CacheStateService.name);
  availabilityChange = new Subject<AvailabilityUpdate>();
  singleItemAvailabilityChange = new Subject<SingleItemAvailabilityUpdate>();

  constructor(
    private messenger: MessengerService,
    @InjectModel('MediaItem')
    private mediaItemModel: any, // TODO: This should be `Model<MediaItemInterface>,` (see * below)
    @InjectModel('Stream')
    private streamModel: any, // TODO: This should be `Model<StreamInterface>,` (see * below)
  ) {}

  // * -->
  // However, the mongoose plugin is not typed. The Typescript compiler therefore
  // complains if methods of the plugin are used in this script. To surpress the
  // typescript error the type of `streamModel` was set to `any`. Proper type
  // definitions should be added.

  async applyCacheStateConfig(cacheStateConfig: CacheStateConfigItemDto[]) {
    await this.mediaItemModel.deleteMany({});
    await this.mediaItemModel.insertMany(cacheStateConfig);
    const streams = []
      // Add image URLs to streams
      // TODO: rename streams --> assets: assets shall cover all sorts of content to be cached
      // not only media streams, but also images and documents (JSON, HTML, CSS, JS)
      .concat(
        ...cacheStateConfig.map((item) => {
          return item.images.map((image) => {
            /* TODO: Verify number, might also better to shift
             * this logic to aggregator or to make it configurable
             * in configurator UI */
            const imageUrl = image.src.replace('{width}', '448');
            return {
              mediaItemId: item.id,
              url: imageUrl,
              urlHash: md5(this.rectifyUrl(imageUrl)), // TODO: Rectify is only needed as long as the cache does not support SSL
              available: false,
            };
          });
        }),
      )
      .concat(
        ...cacheStateConfig.map((item) => {
          return item.streamUrls.map((url) => ({
            mediaItemId: item.id,
            url,
            urlHash: md5(this.rectifyUrl(url)),
            available: false,
          }));
        }),
      );
    await this.streamModel.deleteMany({});
    await this.streamModel.insertMany(streams);
    this.messenger.publish('new-cache-state', JSON.stringify(routes));
    return true;
  }

  /**
   * Gets rid of query parameters
   * (Reason see NGINX config)
   * @param url
   * @returns url
   */
  private rectifyUrl(url: string): string {
    // return url.replace(/(^[a-z]+:)?\/\//, 'http://');
    const u = new URL(url);
    return 'http://' + u.hostname + (u.port ? ':' + u.port : '') + u.pathname;
  }

  async getAllMediaItems(limit: number, page: number) {
    return this.mediaItemModel.paginate({}, { limit, page });
  }

  async getMediaItemById(id: string) {
    return this.mediaItemModel.find({ id }, { _id: 0 }).exec();
  }

  async getAllStreams(limit: number, page: number) {
    return this.streamModel.paginate({}, { limit, page });
  }

  async getAllStreamsForMediaItem(
    mediaItemId: string,
    limit: number,
    page: number,
  ) {
    return this.streamModel.paginate({ mediaItemId }, { limit, page });
  }

  async getStreamById(id: string) {
    return this.streamModel.find({ urlHash: id }).exec();
  }

  async setAvailabilityForStream(id: string, available: boolean) {
    // `res` contains the old state representation
    const res = (await this.streamModel.findOneAndUpdate(
      { urlHash: id },
      { $set: { available } },
    )) as StreamInterface;

    // Emit availability change if value of available changed
    if (res.available !== available) {
      this.emitMediaItemAvailabilityUpdate(res.mediaItemId);
      this.emitAvailabilityChange();
    }

    return res;
  }

  private async emitMediaItemAvailabilityUpdate(id) {
    const availability = await this.getAvailabilityForMediaItem(id);
    this.singleItemAvailabilityChange.next(
      new SingleItemAvailabilityUpdate(id, availability),
    );
  }

  private async emitAvailabilityChange() {
    const availability = await this.getAvailability();
    this.availabilityChange.next(new AvailabilityUpdate(availability));
  }

  async setAvailabilityForStreams(streams: StreamInfoDto[]) {
    this.logger.debug(
      `setAvailabilityForStreams(): Updating #streams: ${streams.length}`,
    );
    const res = await Promise.map(
      streams,
      (stream: StreamInfoDto) =>
        this.setAvailabilityForStream(stream.urlHash, stream.available),
      {
        concurrency: 100,
      },
    );

    this.logger.debug(
      `setAvailabilityForStreams(): Updated ${res.reduce(
        (a, c) => (typeof c === 'object' ? ++a : a),
        0,
      )} of ${res.length}`,
    );

    return res;
  }

  async getAvailableStreams(limit?: number, page?: number) {
    return this.streamModel.paginate({ available: true }, { limit, page });
  }

  async getAvailableStreamsForMediaItem(
    mediaItemId: string,
    limit?: number,
    page?: number,
  ) {
    return this.streamModel.paginate(
      { mediaItemId, available: true },
      { limit, page },
    );
  }

  async getMissingStreams(limit?: number, page?: number) {
    return this.streamModel.paginate({ available: false }, { limit, page });
  }

  async getMissingStreamsForMediaItem(
    mediaItemId: string,
    limit?: number,
    page?: number,
  ) {
    return this.streamModel.paginate(
      { mediaItemId, available: false },
      { limit, page },
    );
  }

  async getAvailability() {
    const available = (await this.getAvailableStreams()).totalDocs;
    const missing = (await this.getMissingStreams()).totalDocs;
    const expected = available + missing;
    return {
      available,
      missing,
      expected,
    };
  }

  async getAvailabilityForMediaItem(id: string) {
    const missing = (await this.getMissingStreamsForMediaItem(id)).totalDocs;
    const available = (await this.getAvailableStreamsForMediaItem(id))
      .totalDocs;
    const expected = missing + available;
    return {
      available,
      missing,
      expected,
    };
  }
}
