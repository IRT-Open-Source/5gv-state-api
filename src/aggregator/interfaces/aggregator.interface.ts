import { Document } from 'mongoose';

export interface AggregatorInterface extends Document {
  name: string;
  configItems: [
    {
      criterion: string;
      value: number;
    },
  ];
  cronJobActive: boolean;
  cronJobInterval: number;
  lastProcessed: number;
}
