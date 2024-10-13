import {defineStore} from 'pinia'
import axios from 'axios'

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
                axios.defaults.headers.common["Authorization"] = `Token ${this.token}`
            }
            return response
        },
        async singUp(username, password, email) {
            return await axios.post('/api/v1/users/account/', {username, password, email}).catch((error) => error)
        },
        logout() {
            this.token = ''
            localStorage.removeItem('token')
            axios.defaults.headers.common["Authorization"] = ''
            this.isAuth = false
        }
    }
})
