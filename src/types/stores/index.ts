import {IUserDefaultData, IDateTime} from "../globals";

interface IAuthenticationStoreUser {
  id: number;
  name: string;
  username: string;
  email?: string;
  desc: string;
  avatar?: string;
  timezone?: string;
  is2faEnabled?: boolean;
}

interface IAuthenticationStoreState {
  user: IAuthenticationStoreUser;
  sessionKey?: string;
  socket: undefined | WebSocket;
  isAuth: boolean;
  token: string;
  availibleTimezones: Array<string>;
}

interface IUserPublicData {
  username: string;
  avatar?: string;
}

interface IUserSettingsUpdates {
  name?: string;
  email?: string;
  avatar?: File;
  desc?: string;
  is2faEnabled?: boolean;
  timezone?: string;
}

interface IMessage {
  id: number,
  chat: number,
  sender: IUserDefaultData,
  receiver: IUserDefaultData,
  body: string,
  attachment: string,
  time_added: IDateTime,
  time_updated: IDateTime,
  is_read: boolean
}

interface IChat {
  id: number,
  user: IUserDefaultData,
  last_message: IMessage
}

export {
  IAuthenticationStoreUser,
  IAuthenticationStoreState,
  IUserPublicData,
  IUserSettingsUpdates,
  IMessage,
  IChat
};
