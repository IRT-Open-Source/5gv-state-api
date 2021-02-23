import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Req,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { AggregatorService } from './aggregator.service';
import { Aggregator } from '5gv-dto';
import { AggregatorInterface } from './interfaces/aggregator.interface';
import { UrlParameters } from '../common-interfaces/url-parameters.interface';
import { PagingQuery } from '../common-interfaces/paging-query.interface';

@Controller('aggregator')
export class AggregatorController {
  logger = new Logger(AggregatorController.name);

  constructor(private as: AggregatorService) {}

  @Get('config')
  async getAllConfigs(
    @Req() request: Request,
    @Query() query: PagingQuery,
  ): Promise<AggregatorInterface[]> {
    this.logger.verbose(`GET: ${request.url}`);
    const q = this.parsePagingQuery(query);
    return await this.as.getAllAggregatorConfigs(q.limit, q.page);
  }

  @Get('config/latest')
  async getLatestConfig(@Req() request: Request, @Param() params: UrlParameters) {
    this.logger.verbose(`GET: ${request.url}`);
    return await this.as.getLatestAggregatorConfig();
  }

  @Get('config/:id')
  async getConfigById(@Req() request: Request, @Param() params: UrlParameters) {
    this.logger.verbose(`GET: ${request.url}`);
    return await this.as.getAggregatorConfig(params.id);
  }

  @Patch('config/:name/lastprocessed')
  async updateLastProcessed(
    @Req() request: Request,
    @Param() params: { name: string },
    @Body() config: { lastProcessed: number },
  ) {
    this.logger.verbose(`PATCH: ${request.url}: ${config.lastProcessed}`);
    return await this.as.updateLastProcessed(params.name, config.lastProcessed);
  }

  @Post('config')
  async postConfig(
    @Req() request: Request,
    @Body() config: Aggregator.ConfigDto,
  ) {
    this.logger.log(`POST: ${request.url}: ${config}`);
    return this.as.addAggregatorConfig(config);
  }

  private parsePagingQuery(query: PagingQuery) {
    const limit = parseInt(query.limit, 10) || 10;
    const page = (query.page && parseInt(query.page, 10)) || 1;
    return { limit, page };
  }
}
