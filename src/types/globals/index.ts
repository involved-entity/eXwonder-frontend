export interface IUserPublicData {
  username: string;
  avatar?: string;
}

export interface IUserDefaultData extends IUserPublicData {
  id: number;
  is_online: boolean;
}

export interface IUserExtendedData extends IUserDefaultData {
  posts_count: number;
  is_followed: boolean;
  followers_count: number;
  followings_count: number;
}

export interface IDateTime {
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

export interface IComment extends IDefaultInstance {
  post: number;
  comment: string;
}

export interface IImage {
  id: number;
  image: string;
  image_crop: string;
}

export interface IPost extends IDefaultInstance {
  signature: string;
  images: IImage[];
  comments_count: number;
  is_commented: boolean;
  is_saved: boolean;
  activeImage?: number;
  isModalVisible?: boolean;
}

export interface INotification {
  id: number;
  receiver: IUserDefaultData;
  is_read: boolean;
  time_added: IDateTime;
}

export enum Tops {
  RECENT = "recent",
  UPDATES = "updates",
  LIKES = "likes",
  RECOMMENDED = "recommended",
}

interface IMessageFile {
  link: string;
  name: string;
}

export interface IMessage {
  id: number;
  chat: number;
  sender: IUserDefaultData;
  receiver: IUserDefaultData;
  body: string;
  attachment: null | IMessageFile;
  time_added: IDateTime;
  time_updated: IDateTime;
  is_edit: boolean;
  is_read: boolean;
}

export interface IChat {
  id: number;
  user: IUserDefaultData;
  last_message: IMessage;
  is_read: boolean;
}
