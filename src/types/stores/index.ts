interface IAuthenticationStoreUser {
  id: number;
  name: string,
  username: string;
  email?: string;
  desc: string,
  avatar?: string;
  timezone?: string;
  is2faEnabled?: boolean;
}

interface IAuthenticationStoreState {
  user: IAuthenticationStoreUser;
  sessionKey?: string;
  isAuth: boolean;
  token: string;
  availibleTimezones: Array<string>;
}

interface IUserPublicData {
  username: string;
  avatar?: string;
}

interface IUserSettingsUpdates {
  name?: string
  email?: string;
  avatar?: File;
  desc?: string
  is2faEnabled?: boolean;
  timezone?: string;
}

interface IPostCreate {
  signature?: string;
  (key: string): File | string;
}

export {
  IAuthenticationStoreUser,
  IAuthenticationStoreState,
  IUserPublicData,
  IUserSettingsUpdates,
  IPostCreate,
};
