import { WsResponse } from '@nestjs/websockets';
import { AvailabilityDto } from '../dto/availability.dto';
import { SingleItemAvailabilityDto } from '../dto/single-item-availability.dto';

export class SingleItemAvailabilityUpdate implements WsResponse {
  event = 'single-item-availability';
  data: SingleItemAvailabilityDto;
  constructor(id: string, availability: AvailabilityDto) {
    this.data = { id, availability };
  }
}
