import { defineStore } from "pinia";
import { MessengerUrl } from "../settings.ts";
import { IMessage, IChat, ISendMessage, IEditMessage } from "../types/stores";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { IUserDefaultData, IUserExtendedData } from "../types/globals";
import { arrayBufferToBase64, parseDate } from "../helpers";

export const useMessengerStore = defineStore("messenger", {
  state: () => ({
    messages: [] as IMessage[],
    chats: [] as IChat[],
    chatsWithHistory: [] as number[],
    socket: undefined as WebSocket | undefined,
    activeChat: undefined as IChat | undefined,
  }),

  actions: {
    changeActiveChat(chat: IChat) {
      if (this.activeChat !== chat) {
        this.activeChat = chat;
      }
    },

    sendSocketMessage(message: object) {
      this.socket!.send(JSON.stringify(message));
    },

    authenticate() {
      const authStore = useAuthenticationStore();
      this.sendSocketMessage({
        type: "authenticate",
        token: authStore.token,
        user_id: authStore.user.id,
      });
      this.sendSocketMessage({
        type: "connect_to_chats",
      });
    },

    onSocketOpen() {
      this.authenticate();
    },

    startChat(user: IUserExtendedData) {
      this.sendSocketMessage({
        type: "start_chat",
        receiver: user.id,
      });
    },

    getChatHistory(chatId?: number): boolean {
      const id = chatId ?? this.activeChat!.id;
      if (!this.chatsWithHistory.includes(id)) {
        this.sendSocketMessage({
          type: "get_chat_history",
          chat: id,
        });
        this.chatsWithHistory.push(id);
        return true;
      }
      return false;
    },

    sendMessage(chatId: number, receiverId: number, body: string, attachment?: File) {
      const message: ISendMessage = {
        type: "send_message",
        chat_id: chatId,
        receiver: receiverId,
        body,
      };

      if (attachment) {
        const reader = new FileReader();
        reader.onload = e => {
          const arrayBuffer = e.target!.result;
          message.attachment = arrayBufferToBase64(arrayBuffer as ArrayBuffer);
          message.attachment_name = attachment.name;
          this.sendSocketMessage(message);
        };
        reader.readAsArrayBuffer(attachment);
      } else {
        this.sendSocketMessage(message);
      }
    },

    markChatRead(chatId?: number): boolean {
      const id = chatId ?? this.activeChat!.id;
      const authStore = useAuthenticationStore();
      const chat = this.chats.find(chat => chat.id === id);
      const isUserLastMessageReceiver = authStore.user.id === chat?.last_message.receiver.id;

      if (isUserLastMessageReceiver) {
        this.sendSocketMessage({ type: "read_chat", id });
      }
      return isUserLastMessageReceiver;
    },

    markMessageDelete(message: IMessage): boolean {
      const authStore = useAuthenticationStore();
      const canDelete = authStore.user.id === message.sender.id;

      if (canDelete) {
        this.sendSocketMessage({ type: "delete_message", id: message.id });
      }
      return canDelete;
    },

    markChatDelete(chat: IChat): boolean {
      this.sendSocketMessage({ type: "delete_chat", id: chat.id });
      return true;
    },

    sortChatsByLastMessageTimeAdded(sourceArray?: IChat[]) {
      const array = sourceArray ?? this.chats;
      this.chats = array.sort((a, b) => {
        const dateA = a.last_message.time_added
          ? parseDate(a.last_message.time_added.time_added)
          : -Infinity;
        const dateB = b.last_message.time_added
          ? parseDate(b.last_message.time_added.time_added)
          : -Infinity;
        return dateB - dateA;
      });
    },

    editMessage(messageId: number, body: string, attachment?: File) {
      const message: IEditMessage = {
        type: "edit_message",
        message: messageId,
        body,
      };

      if (attachment) {
        const reader = new FileReader();
        reader.onload = e => {
          const arrayBuffer = e.target!.result;
          message.attachment = arrayBufferToBase64(arrayBuffer as ArrayBuffer);
          message.attachment_name = attachment.name;
          this.sendSocketMessage(message);
        };
        reader.readAsArrayBuffer(attachment);
      } else {
        this.sendSocketMessage(message);
      }
    },

    changeUserOnlineStatus(user: IUserDefaultData, isOnline: boolean = true) {
      this.chats = this.chats.map(chat => {
        const updatedChat =
          chat.user.id === user.id
            ? { ...chat, user: { ...chat.user, is_online: isOnline } }
            : chat;
        if (this.activeChat && this.activeChat.id === updatedChat.id) {
          this.activeChat = updatedChat;
        }
        return updatedChat;
      });
    },

    handleIncomingMessage(data: any) {
      const type = data.type;

      switch (type) {
        case "connect_to_chats":
          this.sortChatsByLastMessageTimeAdded(data.payload);
          break;

        case "chat_started":
        case "connect_to_chat":
          this.chats.push(data.payload);
          this.sortChatsByLastMessageTimeAdded();
          break;

        case "get_chat_history":
          this.messages = [...data.payload, ...this.messages];
          break;

        case "on_message":
          this.handleNewMessage(data.payload);
          break;

        case "send_read_chat":
          this.markChatAsRead(data.chat);
          break;

        case "send_delete_message":
          this.handleDeleteMessage(data);
          break;

        case "send_delete_chat":
          this.handleDeleteChat(data);
          break;

        case "send_edit_message":
          this.handleEditMessage(data.message);
          break;

        case "user_online":
          this.changeUserOnlineStatus(data.user);
          break;

        case "user_offline":
          this.changeUserOnlineStatus(data.user, false);
          break;
      }
    },

    handleNewMessage(message: IMessage) {
      const isUnique = !this.messages.some(msg => msg.id === message.id);
      const hasChatHistory = this.chatsWithHistory.includes(message.chat);

      if (isUnique && hasChatHistory) {
        this.messages.unshift(message);
      }

      const updateChatLastMessage = (chat: IChat) => {
        return chat.id === message.chat ? { ...chat, last_message: message } : chat;
      };
      this.chats = this.chats.map(updateChatLastMessage);

      const chatIndex = this.chats.findIndex(chat => chat.id === message.chat);
      const [chat] = this.chats.splice(chatIndex, 1);
      this.chats.unshift(chat);

      if (this.activeChat && message.chat === this.activeChat.id) {
        this.markChatRead();
      } else {
        const authStore = useAuthenticationStore();
        const isUserReceiver = authStore.user.id === message.receiver.id;
        if (isUserReceiver) {
          this.chats.find(chat => chat.id === message.chat)!.is_read = false;
        }
      }
    },

    markChatAsRead(chatId: number) {
      this.chats = this.chats.map(chat => (chat.id === chatId ? { ...chat, is_read: true } : chat));
      this.messages = this.messages.map(message =>
        message.chat === chatId && !message.is_read ? { ...message, is_read: true } : message
      );
    },

    handleDeleteMessage(data: any) {
      const messageIndex = this.messages.findIndex(message => message.id === data.message);
      if (messageIndex !== -1) {
        const chatId = this.messages[messageIndex].chat;
        this.chats = this.chats.map(chat => (chat.id === chatId ? data.chat : chat));
        this.messages.splice(messageIndex, 1);
        this.sortChatsByLastMessageTimeAdded();
      }
    },

    handleDeleteChat(data: any) {
      if (this.activeChat && this.activeChat.id === data.chat) {
        this.activeChat = undefined;
      }
      this.messages = this.messages.filter(message => message.chat !== data.chat);
      this.chats = this.chats.filter(chat => chat.id !== data.chat);
    },

    handleEditMessage(message: IMessage) {
      this.messages = this.messages.map(msg => (msg.id === message.id ? message : msg));
      this.chats = this.chats.map(chat =>
        chat.last_message.id === message.id ? { ...chat, last_message: message } : chat
      );
    },

    onSocketMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);
      this.handleIncomingMessage(data);
    },

    initMessenger() {
      const authStore = useAuthenticationStore();
      if (authStore.isAuth) {
        this.socket = new WebSocket(MessengerUrl);
        this.socket.onopen = this.onSocketOpen;
        this.socket.onmessage = this.onSocketMessage.bind(this);
        this.socket.onclose = event => {
          console.error("Connection closed:", event);
          if (event.code) {
            console.error("Close code:", event.code);
          }
        };
      }
    },

    closeAndClear() {
      this.socket!.close(1000);
      this.socket = undefined;
      this.chats = [];
      this.messages = [];
      this.activeChat = undefined;
    },
  },
});
