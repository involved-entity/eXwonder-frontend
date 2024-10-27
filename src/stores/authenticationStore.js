import {defineStore} from 'pinia'
import axios from '../client'
import coreAxios from 'axios'

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
            const response = await axios.post('/api/v1/account/account/login/', {username, password}).catch((error) => error)
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token)
                this.token = response.data.token
                this.isAuth = true
            }
            return response
        },
        async twoFactorAuthentication(code) {
            const response = await axios.post('/api/v1/account/account/two-factor-authentication/', {
                auth_code: code,
                session_key: this.sessionKey
            }).catch((error) => error)
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
            if (response.status !== coreAxios.HttpStatusCode.NoContent) {
                return response.response.data
            }
            await this.getMe(true)
        },
        async resetPassword(email) {
            return await axios.post('/api/v1/account/password-reset/', {email}).catch(error => error)
        },
        async resetPasswordConfirm(uid, token, password1, password2) {
            const response = await axios.post('/api/v1/account/password-reset-confirm/', {
                uid,
                token,
                new_password1: password1,
                new_password2: password2
            }).catch(error => error)
            if (response.status !== coreAxios.HttpStatusCode.Ok) {
                if (response.response.data.new_password2?.length) {
                    return 'Password is too common.'
                }
                return 'Token is invalid. Please retry to reset password.'
            }
            return ''
        },
        async changePassword(oldPassword, newPassword1, newPassword2) {
            const response = await axios.post('/api/v1/account/password-change/', {
                old_password: oldPassword,
                new_password1: newPassword1,
                new_password2: newPassword2
            }).catch(error => error)
            return response
        }
    }
})
