import { UserFilterOptions } from "./filter";

export default interface FollowFollowersOptions {
  username: string;
  amount: number;
  delay?: number;
  filter?: UserFilterOptions;
}
