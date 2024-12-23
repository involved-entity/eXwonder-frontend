import { IUserDefaultData } from "./globals";

export interface IUserFollowData {
  id: number;
  posts_count: number;
  is_followed: boolean;
  followers_count: number;
  followings_count: number;
  follower?: IUserDefaultData;
  following?: IUserDefaultData;
}
