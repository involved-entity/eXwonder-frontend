import {defineStore} from "pinia";
import {MessengerUrl} from "../settings.ts";
import {IMessage, IChat} from "../types/stores";
import {useAuthenticationStore} from "../stores/authenticationStore.ts";
import {IUserExtendedData} from "../types/globals";
import {arrayBufferToBase64} from "../helpers"

export const useMessengerStore = defineStore("messenger", {
    state() {
        return {
            messages: [] as Array<IMessage>,
            chats: [] as Array<IChat>,
            socket: undefined as WebSocket | undefined,
            activeChat: undefined as IChat | undefined
        }
    },
    actions: {
        changeActiveChat(chat: IChat) {
            this.activeChat = chat
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
                receiver: user.id
            })
            this.socket!.send(data)
        },
        getChatHistory(chatId: number) {
            const data = JSON.stringify({
                type: "get_chat_history",
                chat: chatId
            })
            this.socket!.send(data)
        },
        clearMessages() {
            this.messages = []
        },
        sendMessage(chatId: number, receiverId: number, body: string, attachment: File) {
            if (attachment) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    const data = JSON.stringify({
                        type: "send_message",
                        chat_id: chatId,
                        receiver: receiverId,
                        body,
                        attachment: arrayBufferToBase64(arrayBuffer),
                        attachment_name: attachment.name
                    })
                    this.socket!.send(data)
                };
                reader.readAsArrayBuffer(attachment);
            } else {
                const data = JSON.stringify({
                    type: "send_message",
                    chat_id: chatId,
                    receiver: receiverId,
                    body
                })
                this.socket!.send(data)
            }
        },
        onSocketMessage(event: object) {
            const data = JSON.parse(event.data);
            const type = data.type
            switch (type) {
                case "connect_to_chats":
                    this.chats = data.payload
                    break;
                case "chat_started":
                    this.chats.push(data.payload)
                    break;
                case "get_chat_history":
                    this.messages = data.payload
                    break;
                case "on_message":
                    if (this.activeChat.id === data.payload.chat) {
                        this.messages.unshift(data.payload)
                        this.chats.map(chat => chat.id === data.payload.chat ? {...chat, last_message: data.payload} : chat)
                    }
                    break;
            }
        },
        initMessenger() {
            const authStore = useAuthenticationStore();
            if (authStore.isAuth) {
                this.socket = new WebSocket(MessengerUrl)
                this.socket.onopen = this.onSocketOpen
                this.socket.onmessage = this.onSocketMessage;
                this.socket.onclose = function (event) {
                    console.log("Соединение закрыто:", event);
                    if (event.code) {
                        console.error("Код закрытия:", event.code);
                    }
                };
            }
        }
    }
})
