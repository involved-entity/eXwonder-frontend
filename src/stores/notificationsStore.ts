import { defineStore } from "pinia";
import { INotification } from "../types/globals";
import { useAuthenticationStore } from "./authenticationStore.ts";
import { NotificationsUrl } from "../settings.ts";

export const useNotificationsStore = defineStore("notifs", {
  state() {
    return {
      socket: undefined as WebSocket | undefined,
      notifications: [] as Array<INotification>,
    };
  },
  actions: {
    onSocketOpen() {
      const authStore = useAuthenticationStore();
      this.sendSocketMessage({
        type: "authenticate",
        token: authStore.token,
        user_id: authStore.user.id,
      });
      this.sendSocketMessage({ type: "get_unreaded_notifications" });
    },

    markRead(notifId: number) {
      this.sendSocketMessage({
        type: "mark_read",
        id: notifId,
      });
      this.notifications = this.notifications.filter(notification => notification.id !== notifId);
    },

    markAllRead() {
      this.sendSocketMessage({ type: "mark_all_read" });
      this.notifications = [];
    },

    onSocketMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "notify":
          this.notifications.unshift(data.payload);
          break;
        case "get_unreaded_notifications":
          this.notifications.push(...data.payload);
          break;
      }
    },

    initNotifications() {
      const authStore = useAuthenticationStore();
      if (authStore.isAuth) {
        this.socket = new WebSocket(NotificationsUrl);
        this.socket.onopen = this.onSocketOpen.bind(this);
        this.socket.onmessage = this.onSocketMessage.bind(this);
        this.socket.onclose = event => {
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
      this.notifications = [];
    },

    sendSocketMessage(data: object) {
      this.socket!.send(JSON.stringify(data));
    },
  },
});
