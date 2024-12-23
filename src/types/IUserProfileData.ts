import { IUserDefaultData } from "./globals";

export interface IUserProfileData extends IUserDefaultData {
  name: string;
  desc: string;
}
