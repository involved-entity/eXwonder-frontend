import { IUserPublicData } from "@/types/stores";

interface IUserDefaultData extends IUserPublicData {
  id: number;
}

interface IUserProfileData extends IUserDefaultData {
  name: string;
  desc: string;
}

interface IUserExtendedData extends IUserDefaultData {
  posts_count: number;
  is_followed: boolean;
  followers_count: number;
  followings_count: number;
}

interface IUserFollowData {
  id: number;
  posts_count: number;
  is_followed: boolean;
  followers_count: number;
  followings_count: number;
  follower?: IUserDefaultData;
  following?: IUserDefaultData;
}

interface IDateTime {
  time_added: string;
  timezone: string;
}

interface IDefaultInstance {
  id: number;
  author: IUserDefaultData;
  time_added: IDateTime;
  is_liked: boolean;
  likes_count: number;
}

interface IComment extends IDefaultInstance {
  post: number;
  comment: string;
}

interface IImage {
  id: number;
  image: string;
  image_crop: string;
}

interface IPost extends IDefaultInstance {
  signature: string;
  images: Array<IImage>;
  comments_count: number;
  is_commented: boolean;
  is_saved: boolean;
  activeImage?: number;
  isModalVisible?: boolean;
}

interface INotification {
  id: number;
  receiver: IUserDefaultData;
  is_read: boolean;
  time_added: IDateTime;
}

enum Tops {
  RECENT = "recent",
  UPDATES = "updates",
  LIKES = "likes",
  RECOMMENDED = "recommended",
}

export {
  IUserDefaultData,
  IUserProfileData,
  IUserExtendedData,
  IComment,
  IPost,
  Tops,
  IUserFollowData,
  INotification,
  IDateTime
};
