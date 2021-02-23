import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Logger,
  Patch,
  Req,
  Query,
} from '@nestjs/common';
import { CacheStateConfigItemDto } from './dto/cache-state-config-item.dto';
import { CacheStateService } from './cache-state.service';
import { Request } from 'express';
import { PagingQuery } from 'src/common-interfaces/paging-query.interface';
import { UrlParameters } from 'src/common-interfaces/url-parameters.interface';
import { StreamInfoDto } from './dto/stream-info.dto';

@Controller('cache-state')
export class CacheStateController {
  logger = new Logger(CacheStateController.name);
  constructor(private cs: CacheStateService) {}

  @Post()
  postCacheStateConfig(
    @Req() request: Request,
    @Body() cacheStateConfig: CacheStateConfigItemDto[],
  ) {
    this.logger.verbose(`POST: ${request.url}`);
    this.cs.applyCacheStateConfig(cacheStateConfig);
    return 'ok';
  }

  @Get('media-items')
  getAllMediaItems(@Req() request: Request, @Query() query: PagingQuery) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getAllMediaItems(q.limit, q.page);
  }

  @Get('media-items/:id/availability')
  getAvailabilityForMediaItem(
    @Req() request: Request,
    @Param() params: UrlParameters,
  ) {
    this.logger.verbose(`GET: ${request.url}`);
    return this.cs.getAvailabilityForMediaItem(params.id);
  }

  @Get('media-items/:id/streams/missing')
  getMissingStreamsForMediaItem(
    @Req() request: Request,
    @Param() params: UrlParameters,
    @Query() query: PagingQuery,
  ) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getMissingStreamsForMediaItem(params.id, q.limit, q.page);
  }

  @Get('media-items/:id/streams/available')
  getAvailableStreamsForMediaItem(
    @Req() request: Request,
    @Param() params: UrlParameters,
    @Query() query: PagingQuery,
  ) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getAvailableStreamsForMediaItem(params.id, q.limit, q.page);
  }

  @Get('media-items/:id/streams')
  getAllStreamsForMediaItem(
    @Req() request: Request,
    @Param() params: { id: string },
    @Query() query: PagingQuery,
  ) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getAllStreamsForMediaItem(params.id, q.limit, q.page);
  }

  @Get('media-items/:id')
  getMediaItemById(@Req() request: Request, @Param() params: { id: string }) {
    this.logger.verbose(`GET: ${request.url}`);
    return this.cs.getMediaItemById(params.id);
  }

  @Get('streams')
  getAllStreams(@Req() request: Request, @Query() query: PagingQuery) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getAllStreams(q.limit, q.page);
  }

  @Get('streams/available')
  getAvailableStreams(@Req() request: Request, @Query() query: PagingQuery) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getAvailableStreams(q.limit, q.page);
  }

  @Post('streams/available')
  setAvailabilityForStreams(@Req() request: Request, @Body() body: StreamInfoDto[]) {
    this.logger.verbose(`POST: ${request.url}`);
    return this.cs.setAvailabilityForStreams(body);
  }

  @Get('streams/missing')
  getMissingStreams(@Req() request: Request, @Query() query: PagingQuery) {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return this.cs.getMissingStreams(q.limit, q.page);
  }

  @Get('streams/availability')
  getAvailability(@Req() request: Request) {
    this.logger.verbose(`GET: ${request.url}`);
    return this.cs.getAvailability();
  }

  @Get('streams/:urlhash')
  getStreamById(@Req() request: Request, @Param() params: { urlhash: string }) {
    this.logger.verbose(`GET: ${request.url}`);
    return this.cs.getStreamById(params.urlhash);
  }

  @Patch('streams/:urlhash/available')
  setAvailabilityForStream(
    @Req() request: Request,
    @Param() params: { urlhash: string },
    @Body() body: any,
  ) {
    this.logger.verbose(`PATCH: ${request.url}`);
    return this.cs.setAvailabilityForStream(params.urlhash, body.available);
  }

  private parsePagingQuery(query: PagingQuery) {
    const limit = parseInt(query.limit, 10) || 10;
    const page = (query.page && parseInt(query.page, 10)) || 1;
    return { limit, page };
  }
}
