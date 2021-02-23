import { WsResponse } from '@nestjs/websockets';
import { AvailabilityDto } from '../dto/availability.dto';

export class AvailabilityUpdate implements WsResponse {
  event = 'availability';
  data: AvailabilityDto;
  constructor(availability: AvailabilityDto) {
    this.data = availability;
  }
}
