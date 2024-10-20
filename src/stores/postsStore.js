import {defineStore} from 'pinia'
import axios from '../client'

export const usePostsStore = defineStore("posts", {
    actions: {
        async createPost(formData) {
            return await axios.post('/api/v1/posts/posts/', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).catch((error) => error)
        },
        async getUserPosts(username, page = 1) {
            return await axios.get(`/api/v1/posts/posts/?user=${username}&page=${page}`).catch((error) => error)
        },
        async getPostsTop(top = 'updates', page = 1) {
            return await axios.get(`/api/v1/posts/posts/?top=${top}&page=${page}`).catch(error => error)
        }
    }
})
