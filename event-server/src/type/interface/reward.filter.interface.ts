import { RewardType } from '../enum/rewardType.enum';

export interface RewardFilter {
  type?: RewardType;
  $or?: Array<{
    expiryDate?: {
      $exists?: boolean;
    } | null;
  }>;
  $and?: Array<{
    expiryDate?: {
      $exists?: boolean;
      $ne?: null;
    } | null;
  }>;
}
