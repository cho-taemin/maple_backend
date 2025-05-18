import { RewardType } from '../enum/rewardType.enum';

export interface RewardFilter {
  type?: RewardType;
  value?: { $gte?: number; $lte?: number };
  expiryDate?: { $gt?: Date; $lt?: Date };
}
