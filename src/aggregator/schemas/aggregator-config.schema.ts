import * as mongoose from 'mongoose';
import paginate = require('mongoose-paginate-v2');

export const AggregatorConfigSchema = new mongoose.Schema({
  name: String,
  configItems: [{ criterion: String, value: Number }],
  cronJobActive: Boolean,
  cronJobInterval: Number,
  lastProcessed: Number,
}).plugin(paginate);
