import {defineStore} from "pinia";
import { INotification } from "../types/globals";
import { useAuthenticationStore } from "./authenticationStore.ts";
import { NotificationsUrl } from "../settings.ts";

export const useNotificationsStore = defineStore('notifs', {
  state() {
    return {
      socket: undefined as WebSocket | undefined,
      notifications: [] as Array<INotification>,
    }
  },
  actions: {
    onSocketOpen() {
      const authStore = useAuthenticationStore();
      let data = JSON.stringify({
        type: "authenticate",
        token: authStore.token,
        user_id: authStore.user.id,
      });
      this.socket!.send(data);
      data = JSON.stringify({
        type: "get_unreaded_notifications",
      });
      this.socket!.send(data);
    },
    markRead(notifId: number) {
      const data = JSON.stringify({
        type: "mark_read",
        id: notifId,
      });
      this.socket!.send(data);
      this.notifications = this.notifications.filter(
        notification => notification.id !== notifId
      );
    },
    markAllRead() {
      const data = JSON.stringify({
        type: "mark_all_read",
      });
      this.socket!.send(data);
      this.notifications = [];
    },
    onSocketMessage(event: object) {
      const data = JSON.parse(event.data);
      if (data.type === "notify") {
        this.notifications.unshift(data.payload);
      } else if (data.type === "get_unreaded_notifications") {
        this.notifications.push(...data.payload);
      }
    },
    initNotifications() {
      const authStore = useAuthenticationStore();
      if (authStore.isAuth) {
        this.socket = new WebSocket(NotificationsUrl);
        this.socket.onopen = this.onSocketOpen;
        this.socket.onmessage = this.onSocketMessage;
        this.socket.onclose = function (event) {
          console.log("Соединение закрыто:", event);
          if (event.code) {
            console.error("Код закрытия:", event.code);
          }
        };
      }
    },
    closeAndClear() {
      this.socket!.close(1000);
      this.socket = undefined;
      this.notifications = []
    },
  },
})
