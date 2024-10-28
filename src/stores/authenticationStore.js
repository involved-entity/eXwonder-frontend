import {defineStore} from 'pinia'
import axiosCore from 'axios'
import {request} from "../helpers/index.js"

export const useAuthenticationStore = defineStore("authentication", {
    state() {
        return {
            sessionKey: null,
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
            const {success, data} = await request('post', '/api/v1/account/account/login/', {
                username, password
            }, null, axiosCore.HttpStatusCode.Ok, axiosCore.HttpStatusCode.Accepted)
            return {success, data}
        },
        async twoFactorAuthentication(code) {
            const {success, data} = await request('post', '/api/v1/account/account/two-factor-authentication/', {
                auth_code: code,
                session_key: this.sessionKey
            })
            if (success) {
                localStorage.setItem('token', data.token)
                this.token = data.token
                this.isAuth = true
            }
            return {success, data}
        },
        async singUp(username, password, email) {
            return await request('post', '/api/v1/account/account/', {
                username, password, email
            }, null, axiosCore.HttpStatusCode.Created)
        },
        async logout() {
            await request('get', '/api/v1/account/account/logout/', null, null, axiosCore.HttpStatusCode.NoContent)
            this.token = ''
            localStorage.removeItem('token')
            this.isAuth = false
            this.id = 0
            this.username = null
            this.avatar = null
        },
        async getMe(permanent = false) {
            if (!this.id || permanent) {
                const {success, data} = await request('get', '/api/v1/account/account/me/')
                this.id = data.user.id
                this.email = data.user.email
                this.timezone = data.user.timezone
                this.is2faEnabled = data.user.is_2fa_enabled
                this.username = data.user.username
                this.avatar = data.user.avatar
                this.availibleTimezones = data.availible_timezones
            }
            return {username: this.username, avatar: this.avatar}
        }
    }
})
