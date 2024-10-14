import {defineStore} from 'pinia'
import axios from '../client'

export const useAuthenticationStore = defineStore("authentication", {
    state() {
        return {
            isAuth: !!localStorage.getItem('token'),
            token: localStorage.getItem('token') ?? ''
        }
    },
    actions: {
        async login(username, password) {
            const response = await axios.post('/api/v1/users/account/login/', {username, password}).catch((error) => error)
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token)
                this.token = response.data.token
                this.isAuth = true
            }
            return response
        },
        async singUp(username, password, email) {
            return await axios.post('/api/v1/users/account/', {username, password, email}).catch((error) => error)
        },
        logout() {
            this.token = ''
            localStorage.removeItem('token')
            this.isAuth = false
        }
    }
})
