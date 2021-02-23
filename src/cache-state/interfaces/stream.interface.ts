import { Document } from 'mongoose';

export interface StreamInterface extends Document {
  mediaItemId: string;
  url: string;
  available: boolean;
}
