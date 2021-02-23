import { Document } from 'mongoose';

export interface MediaItemInterface extends Document {
  id: string;
  title: string;
  synopsis: string;
  availableTo: string;
  availableFrom: string;
}
