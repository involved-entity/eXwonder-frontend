import {defineStore} from 'pinia'
import axios from '../client'

export const useAuthenticationStore = defineStore("authentication", {
    state() {
        return {
            isAuth: !!localStorage.getItem('token'),
            token: localStorage.getItem('token') ?? '',
            id: 0,
            username: null,
            avatar: null
        }
    },
    actions: {
        async login(username, password) {
            const response = await axios.post('/api/v1/account/account/login/', {username, password}).catch((error) => error)
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token)
                this.token = response.data.token
                this.isAuth = true
            }
            return response
        },
        async singUp(username, password, email) {
            return await axios.post('/api/v1/account/account/', {username, password, email}).catch((error) => error)
        },
        async logout() {
            this.token = ''
            await axios.get('/api/v1/account/account/logout/').catch((error) => error)
            localStorage.removeItem('token')
            this.isAuth = false
            this.id = 0
            this.username = null
            this.avatar = null
        },
        async getMe() {
            if (!this.id) {
                const response = await axios.get('/api/v1/account/account/my/').catch((error) => error)
                this.id = response.data.id
                this.username = response.data.username
                this.avatar = response.data.avatar
            }
            return {id: this.id, username: this.username, avatar: this.avatar}
        }
    }
})
