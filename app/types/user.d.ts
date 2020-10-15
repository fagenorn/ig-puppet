export default interface User {
  username: string;
  name?: string;
  bio?: string;
  website?: string;
  followers: number;
  followings: number;
  posts: number;
  isPrivate: boolean;
}
