import {defineStore} from 'pinia'
import axios from '../client'

export const usePostsStore = defineStore("posts", {
    actions: {
        async createPost(formData) {
            return await axios.post('/api/v1/posts/posts/', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).catch((error) => error)
        }
    }
})
