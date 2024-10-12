import {defineStore} from 'pinia'

export const useAuthenticationStore = defineStore("authentication", {
    state() {
        return {
            isAuth: false,
            token: localStorage.getItem('token') ?? ''
        }
    }
})
