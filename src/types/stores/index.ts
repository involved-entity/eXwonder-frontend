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

export interface IAuthenticationStoreState {
  user: IAuthenticationStoreUser;
  sessionKey?: string;
  isAuth: boolean;
  token: string;
  availibleTimezones: Array<string>;
}

export interface IUserSettingsUpdates {
  name?: string;
  email?: string;
  avatar?: File;
  desc?: string;
  is2faEnabled?: boolean;
  timezone?: string;
}

export interface ISendMessage {
  type: "send_message";
  chat_id: number;
  receiver: number;
  body: string;
  attachment?: string;
  attachment_name?: string;
}

export interface IEditMessage {
  type: "edit_message";
  message: number;
  body: string;
  attachment?: string;
  attachment_name?: string;
}
