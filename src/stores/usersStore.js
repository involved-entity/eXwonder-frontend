import {defineStore} from "pinia"
import {request} from "../helpers/index.js"
import axiosCore from "axios"

export const useUsersStore = defineStore('users', {
    actions: {
        async getUser(username) {
            const {success, data} = await request('get', `/api/v1/account/user/?username=${username}&fields=all`)
            return data
        },
        async getUserFollowings(id, page = 1, search = null) {
            let url = `/api/v1/account/followings/user/${id}/?page=${page}`
            if (search) {url = url + `&search=${search}`}
            return await request('get', url)
        },
        async follow(id) {
            return await request('post', '/api/v1/account/followings/', {following: id}, null, axiosCore.HttpStatusCode.Created)
        },
        async disfollow(id) {
            return await request('post', '/api/v1/account/followings/disfollow/', {following: id}, null, axiosCore.HttpStatusCode.NoContent)
        },
        async searchUsers(usernameQuery) {
            const {success, data} = await request('get', `/api/v1/account/account/?search=${usernameQuery}`)
            return data.results
        },
        async getMyFollowers() {
            return await request('get', '/api/v1/account/followers/')
        }
    }
})
