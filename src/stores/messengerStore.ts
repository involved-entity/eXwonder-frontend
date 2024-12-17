import {defineStore} from "pinia";
import {MessengerUrl} from "../settings.ts";
import {IMessage, IChat} from "../types/stores";
import {useAuthenticationStore} from "../stores/authenticationStore.ts";

export const useMessengerStore = defineStore("messenger", {
    state() {
        return {
            messages: [] as Array<IMessage>,
            chats: [] as Array<IChat>,
            socket: undefined as WebSocket | undefined
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
                type: "connect_to_chats",
            });
            this.socket!.send(data);
        },
        onSocketMessage(event: object) {
            const data = JSON.parse(event.data);
            if (data.type === "connect_to_chats") {
                this.chats = data.payload
                console.log(this.chats)
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
