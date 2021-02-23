import * as mongoose from 'mongoose';
import paginate = require('mongoose-paginate-v2');

export const MediaItemSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    synopsis: String,
    availableTo: String,
    availableFrom: String,
    images: [
      {
        alt: String,
        src: String,
        title: String,
      },
    ],
    streams: [
      {
        url: String,
        type: String,
      },
    ],
  },
  { typeKey: '$type' },
).plugin(paginate);
