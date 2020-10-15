export interface IFilter<T> {
  isFiltered(obj: T): boolean;
}

export interface PostFilterOptions {
  maxLikes?: number;
  minLikes?: number;
  maxAge?: Date;
  minAge?: Date;
  captionWhitelist?: string[];
  captionBlacklist?: string[];
}

export interface UserFilterOptions {
  maxFollowers?: number;
  minFollowers?: number;
  maxFollowings?: number;
  minFollowings?: number;
  maxPosts?: number;
  minPosts?: number;
  mustHaveWebsite?: boolean;
  mustNotBePrivate?: boolean;
  mustHaveName?: boolean;
  bioWhitelist?: string[];
  bioBlacklist?: string[];
}
