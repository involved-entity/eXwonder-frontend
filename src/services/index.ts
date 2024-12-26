import { IPost, IUserDefaultData } from "../types/globals";
import { useMessengerStore } from "../stores/messengerStore.ts";
import { useNotificationsStore } from "../stores/notificationsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

export const getUpdatedFollows = (updates: Array<IPost>): Array<IUserDefaultData> => {
  const followsUsernames: Array<string> = [];
  const updatedFollows: Array<IUserDefaultData> = [];

  updates.forEach((post: IPost) => {
    if (!followsUsernames.includes(post.author.username)) {
      updatedFollows.push(post.author);
      followsUsernames.push(post.author.username);
    }
    post.activeImage = 0;
  });

  return updatedFollows;
};

export const loginAndInitStores = (data: { token: string; user_id: number }): void => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id);
  const authStore = useAuthenticationStore();
  authStore.token = data.token;
  authStore.user.id = data.user_id;
  authStore.isAuth = true;
  const messengerStore = useMessengerStore();
  messengerStore.initMessenger();
  const notifsStore = useNotificationsStore();
  notifsStore.initNotifications();
};
