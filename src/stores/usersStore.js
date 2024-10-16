import {defineStore} from "pinia";
import axios from '../client'

export const useUsersStore = defineStore('users', {
    actions: {
        async getUser(username) {
            const response = await axios.get(`/api/v1/account/account/?username=${username}`).catch((error => error))
            return response.data.results[0]
        },
        async getUserFollowings(id, page = 1) {
            return await axios.get(`/api/v1/account/followings/user/${id}/?page=${page}`).catch(error => error)
        },
        async getUserFollowersCount(id) {
            return await axios.get(`/api/v1/account/followers/user/?id=${id}`).catch(error => error)
        }
    }
})
