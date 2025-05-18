import { EventsCondition } from '../enum/eventCondition.enum';
import { EventStatus } from '../enum/eventStatus.enum';

export interface EventFilter {
  status?: EventStatus;
  conditions?: { $in: EventsCondition[] };
}
