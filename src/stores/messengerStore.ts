import {defineStore} from "pinia";
import {IMessage, IChat} from "../types/stores";

export const useMessengerStore = defineStore("messenger", {
    state() {
        return {
            messages: [] as Array<IMessage>,
            chats: [] as Array<IChat>,
            socket: undefined as WebSocket | undefined
        }
    }
})
