import { UserFilterOptions } from './filter';

export default interface UnfollowFollowersOptions {
  amount: number;
  delay?: number;
  ignoreFollowers?: boolean;
  filter?: UserFilterOptions;
}
