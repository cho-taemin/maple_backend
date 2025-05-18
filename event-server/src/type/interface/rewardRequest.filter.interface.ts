import { RewardRequestStatus } from '../enum/rewardRequest.enum';

export interface RewardRequestFilter {
  userId?: string;
  eventId?: string;
  status?: RewardRequestStatus;
}
