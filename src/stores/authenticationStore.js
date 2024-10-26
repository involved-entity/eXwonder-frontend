import {defineStore} from 'pinia'
import axios from '../client'
import coreAxios from 'axios'

export const useAuthenticationStore = defineStore("authentication", {
    state() {
        return {
            isAuth: !!localStorage.getItem('token'),
            token: localStorage.getItem('token') ?? '',
            id: 0,
            email: '',
            timezone: '',
            is2faEnabled: null,
            username: null,
            avatar: null,
            availibleTimezones: []
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
        async getMe(permanent = false) {
            if (!this.id || permanent) {
                const response = await axios.get('/api/v1/account/account/me/').catch((error) => error)
                this.id = response.data.user.id
                this.email = response.data.user.email
                this.timezone = response.data.user.timezone
                this.is2faEnabled = response.data.user.is_2fa_enabled
                this.username = response.data.user.username
                this.avatar = response.data.user.avatar
                this.availibleTimezones = response.data.availible_timezones
            }
            return {username: this.username, avatar: this.avatar}
        },
        async updateSettings(data) {
            const response = await axios.patch('/api/v1/account/account/update-me/', data, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).catch(error => error)
            if (response.status === coreAxios.HttpStatusCode.NoContent) {
                await this.getMe(true)
                return undefined
            } else {
                return response.response.data
            }
        }
    }
})
