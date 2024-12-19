import { defineStore } from "pinia";
import { MessengerUrl } from "../settings.ts";
import { IMessage, IChat } from "../types/stores";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { IUserExtendedData } from "../types/globals";
import { arrayBufferToBase64, parseDate } from "../helpers";

export const useMessengerStore = defineStore("messenger", {
  state() {
    return {
      messages: [] as Array<IMessage>,
      chats: [] as Array<IChat>,
      chatsWithHistory: [] as Array<number>,
      socket: undefined as WebSocket | undefined,
      activeChat: undefined as IChat | undefined,
    };
  },
  actions: {
    changeActiveChat(chat: IChat) {
      if (this.activeChat !== chat) {
        this.activeChat = chat;
      }
    },
    onSocketOpen() {
      const authStore = useAuthenticationStore();
      let data = JSON.stringify({
        type: "authenticate",
        token: authStore.token,
        user_id: authStore.user.id,
      });
      this.socket!.send(data);
      data = JSON.stringify({
        type: "connect_to_chats",
      });
      this.socket!.send(data);
    },
    startChat(user: IUserExtendedData) {
      const data = JSON.stringify({
        type: "start_chat",
        receiver: user.id,
      });
      this.socket!.send(data);
    },
    getChatHistory(chatId?: number): boolean {
      const checkIsChatHistoryEmtpy = !this.chatsWithHistory.some(
        id => id === chatId
      );
      if (checkIsChatHistoryEmtpy) {
        const data = JSON.stringify({
          type: "get_chat_history",
          chat: chatId ?? this.activeChat!.id,
        });
        this.socket!.send(data);
      }
      return checkIsChatHistoryEmtpy;
    },
    sendMessage(
      chatId: number,
      receiverId: number,
      body: string,
      attachment: File
    ) {
      if (attachment) {
        const reader = new FileReader();
        reader.onload = e => {
          const arrayBuffer = e.target.result;
          const data = JSON.stringify({
            type: "send_message",
            chat_id: chatId,
            receiver: receiverId,
            body,
            attachment: arrayBufferToBase64(arrayBuffer),
            attachment_name: attachment.name,
          });
          this.socket!.send(data);
        };
        reader.readAsArrayBuffer(attachment);
      } else {
        const data = JSON.stringify({
          type: "send_message",
          chat_id: chatId,
          receiver: receiverId,
          body,
        });
        this.socket!.send(data);
      }
    },
    markChatRead(chatId?: number): boolean {
      const id = chatId ?? this.activeChat!.id;
      const authStore = useAuthenticationStore();
      const checkIsUserLastMessageReceiver =
        authStore.user.id ===
        this.chats.find(chat => chat.id === id)!.last_message.receiver.id;
      if (checkIsUserLastMessageReceiver) {
        const data = JSON.stringify({
          type: "read_chat",
          id,
        });
        this.socket!.send(data);
      }
      return checkIsUserLastMessageReceiver;
    },
    markMessageDelete(message: IMessage): boolean {
      const authStore = useAuthenticationStore();
      const checkPermsToDeleteMessage = authStore.user.id === message.sender.id
      if (checkPermsToDeleteMessage) {
        const data = JSON.stringify({
          type: "delete_message",
          id: message.id
        })
        this.socket!.send(data)
      }
      return checkPermsToDeleteMessage
    },
    sortChatsByLastMessageTimeAdded(sourceArray?: Array<IChat>) {
      const array = sourceArray ?? this.chats
      this.chats = array.sort((a: IChat, b: IChat) => {
        const dateA = a.last_message.time_added ? parseDate(a.last_message.time_added.time_added) : -Infinity;
        const dateB = b.last_message.time_added ? parseDate(b.last_message.time_added.time_added) : -Infinity;
        return dateB - dateA
      });
    },
    onSocketMessage(event: object) {
      const data = JSON.parse(event.data);
      const type = data.type;
      switch (type) {
        case "connect_to_chats":
          this.sortChatsByLastMessageTimeAdded(data.payload)
          break;
        case "chat_started":
          this.chats.push(data.payload);
          break;
        case "get_chat_history":
          this.messages = [...data.payload, ...this.messages];
          this.chatsWithHistory.push(data.chat);
          break;
        case "on_message":
          const checkMessageUnique = !this.messages.some(
            msg => msg.id === data.payload.id
          );
          const checkChatHistoryEmpty = this.chatsWithHistory.some(
            id => id === data.payload.chat
          );
          if (checkMessageUnique && checkChatHistoryEmpty) {
            this.messages = [data.payload, ...this.messages];
          }

          const updateChatLastMessage = (chat: IChat): IChat => {
            return chat.id === data.payload.chat
              ? { ...chat, last_message: data.payload }
              : chat;
          };
          this.chats = this.chats.map(updateChatLastMessage);
          const index = this.chats.findIndex(chat => chat.id === data.payload.chat)
          const [chat] = this.chats.splice(index, 1);
          this.chats.unshift(chat);

          const checkChatIsActive =
            this.activeChat && data.payload.chat === this.activeChat!.id;
          if (checkChatIsActive) {
            this.markChatRead();
          } else {
            const authStore = useAuthenticationStore();
            const checkIsUserMessageReceiver =
              authStore.user.id === data.payload.receiver.id;
            if (checkIsUserMessageReceiver)
              this.chats.find(chat => chat.id === data.payload.chat)!.is_read =
                false;
          }
          break;
        case "send_read_chat":
          const updateChatAsRead = (chat: IChat): IChat =>
            chat.id === data.chat ? { ...chat, is_read: true } : chat;
          this.chats = this.chats.map(updateChatAsRead);
          const updateChatMessagesAsRead = (message: IMessage): IMessage => {
            return message.chat === data.chat && !message.is_read
              ? { ...message, is_read: true }
              : message;
          };
          this.messages = this.messages.map(updateChatMessagesAsRead);
          break;
        case "send_delete_message":
          const messageIndex: number = this.messages.findIndex(message => message.id === data.message);
          if (messageIndex !== -1) {
            const changeMessageChatLastMessage = (chat: IChat) => {
              return chat.id === this.messages[messageIndex].chat ? {...chat, last_message: data.last_message} : chat
            }
            this.chats = this.chats.map(changeMessageChatLastMessage)
            this.messages.splice(messageIndex, 1);
            this.sortChatsByLastMessageTimeAdded()
          }
      }
    },
    initMessenger() {
      const authStore = useAuthenticationStore();
      if (authStore.isAuth) {
        this.socket = new WebSocket(MessengerUrl);
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
      this.chats = [];
      this.messages = [];
      this.activeChat = undefined;
    },
  },
});
