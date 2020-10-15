import { IFilter, PostFilterOptions } from '../../../types/filter';
import Post from '../../../types/post';

export default class PostFilter implements IFilter<Post> {
  options: PostFilterOptions;

  constructor(options: PostFilterOptions) {
    this.options = options;
  }

  isFiltered(post: Post): boolean {
    if (this.options.maxLikes) {
      if (post.likes > this.options.maxLikes) {
        return true;
      }
    }

    if (this.options.minLikes) {
      if (post.likes < this.options.minLikes) {
        return true;
      }
    }

    if (this.options.maxAge) {
      if (post.age > this.options.maxAge) {
        return true;
      }
    }

    if (this.options.minAge) {
      if (post.age < this.options.minAge) {
        return true;
      }
    }

    if (this.options.captionWhitelist) {
      if (!post.caption) {
        return true;
      }

      let found = false;
      for (
        let index = 0;
        index < this.options.captionWhitelist.length;
        index += 1
      ) {
        const element = this.options.captionWhitelist[index];
        if (post.caption.toLowerCase().indexOf(element) !== -1) {
          found = true;
        }
      }

      if (!found) {
        return true;
      }
    }

    if (
      this.options.captionBlacklist &&
      post.caption !== null &&
      post.caption
    ) {
      for (
        let index = 0;
        index < this.options.captionBlacklist.length;
        index += 1
      ) {
        const element = this.options.captionBlacklist[index];
        if (post.caption.toLowerCase().indexOf(element) !== -1) {
          return true;
        }
      }
    }

    return false;
  }
}
