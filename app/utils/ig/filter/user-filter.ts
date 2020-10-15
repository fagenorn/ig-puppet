import { IFilter, UserFilterOptions } from '../../../types/filter';
import User from '../../../types/user';

export default class UserFilter implements IFilter<User> {
  options: UserFilterOptions;

  constructor(options: UserFilterOptions) {
    this.options = options;
  }

  isFiltered(user: User): boolean {
    if (this.options.maxFollowers) {
      if (user.followers > this.options.maxFollowers) {
        return true;
      }
    }

    if (this.options.minFollowers) {
      if (user.followers < this.options.minFollowers) {
        return true;
      }
    }

    if (this.options.maxFollowings) {
      if (user.followings > this.options.maxFollowings) {
        return true;
      }
    }

    if (this.options.minFollowings) {
      if (user.followings < this.options.minFollowings) {
        return true;
      }
    }

    if (this.options.maxPosts) {
      if (user.posts > this.options.maxPosts) {
        return true;
      }
    }

    if (this.options.minPosts) {
      if (user.posts < this.options.minPosts) {
        return true;
      }
    }

    if (this.options.mustHaveWebsite && !user.website) {
      return true;
    }

    if (this.options.mustNotBePrivate && user.isPrivate) {
      return true;
    }

    if (this.options.mustHaveName && !user.name) {
      return true;
    }

    if (this.options.bioWhitelist) {
      if (!user.bio) {
        return true;
      }

      let found = false;
      for (
        let index = 0;
        index < this.options.bioWhitelist.length;
        index += 1
      ) {
        const element = this.options.bioWhitelist[index];
        if (user.bio.toLowerCase().indexOf(element) !== -1) {
          found = true;
        }
      }

      if (!found) {
        return true;
      }
    }

    if (this.options.bioBlacklist && user.bio !== null && user.bio) {
      for (
        let index = 0;
        index < this.options.bioBlacklist.length;
        index += 1
      ) {
        const element = this.options.bioBlacklist[index];
        if (user.bio.toLowerCase().indexOf(element) !== -1) {
          return true;
        }
      }
    }

    return false;
  }
}
