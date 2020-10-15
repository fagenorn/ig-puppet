import { PostFilterOptions } from './filter';

export default interface LikeHashtagOptions {
  tag: string;
  amount: number;
  includeTop?: boolean;
  delay?: number;
  filter?: PostFilterOptions;
}
