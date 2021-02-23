import * as mongoose from 'mongoose';
import paginate = require('mongoose-paginate-v2');

export const StreamSchema = new mongoose.Schema({
  mediaItemId: String,
  url: String,
  urlHash: String,
  available: Boolean,
}).plugin(paginate);
