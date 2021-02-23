import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AggregatorInterface } from './interfaces/aggregator.interface';
import { Aggregator } from '5gv-dto';
import { MessengerService } from 'src/messenger/messenger.service';
import * as routes from './routes.json';

@Injectable()
export class AggregatorService {
  constructor(
    private messenger: MessengerService,
    @InjectModel('AggregatorConfig')
    private aggregatorModel: any, // TODO: This should be `Model<AggregatorInterface>,` (see * below)
  ) {}

  // * -->
  // However, the mongoose plugin is not typed. The Typescript compiler therefore
  // complains if methods of the plugin are used in this script. To surpress the
  // typescript error the type of `streamModel** was set to `any`. Proper type
  // definitions should be added.

  async addAggregatorConfig(
    configToAdd: Aggregator.ConfigDto,
  ): Promise<AggregatorInterface> {
    const newConfig = new this.aggregatorModel(configToAdd);
    const id = (await newConfig.save())._id;
    this.messenger.publish('new-aggregator-config', `${routes.config}/${id}`);
    return id;
  }

  async getAllAggregatorConfigs(
    limit: number,
    page: number,
  ): Promise<AggregatorInterface[]> {
    return this.aggregatorModel.paginate({}, { limit, page });
  }

  async getAggregatorConfig(id: string): Promise<AggregatorInterface> {
    return this.aggregatorModel.findOne({ _id: id }).exec();
  }

  getLatestAggregatorConfig() {
    return this.aggregatorModel
      .find({})
      .sort({ _id: 'descending' })
      .limit(1)
      .exec();
  }

  async updateLastProcessed(name: string, lastProcessed: number) {
    return this.aggregatorModel.findOneAndUpdate(
      { name },
      { $set: { lastProcessed } },
      { useFindAndModify: false },
    );
  }
}
