import {defineStore} from "pinia";
import axios from '../client'

export const useUsersStore = defineStore('users', {
    actions: {
        async getUser(username) {
            const response = await axios.get(`/api/v1/account/user/?username=${username}&fields=all`).catch((error => error))
            return response.data
        },
        async getUserFollowings(id, page = 1) {
            return await axios.get(`/api/v1/account/followings/user/${id}/?page=${page}`).catch(error => error)
        },
        async getUserFollowersCount(id) {
            return await axios.get(`/api/v1/account/followers/user/?id=${id}`).catch(error => error)
        },
        async follow(id) {
            return await axios.post('/api/v1/account/followings/', {following: id}).catch(error => error)
        },
        async disfollow(id) {
            return await axios.post('/api/v1/account/followings/disfollow/', {following: id}).catch(error => error)
        },
        async searchUsers(usernameQuery) {
            const response = await axios.get(`/api/v1/account/account/?search=${usernameQuery}`).catch(error => error)
            return response.data.results
        }
    }
})
