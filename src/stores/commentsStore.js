import {defineStore} from "pinia";
import axios from '../client'

export const useCommentsStore = defineStore("comments", {
    actions: {
        async getPostComments(postId) {
            return await axios.get(`/api/v1/posts/comments/?post_id=${postId}`).catch(error => error)
        },
        async addComment(postId, comment) {
            return await axios.post('/api/v1/posts/comments/', {
                post_id: postId,
                comment
            }).catch(error => error)
        },
        async addLike(postId) {
            return await axios.post(`/api/v1/posts/likes/`, {
                post_id: postId
            }).catch(error => error)
        },
        async deleteLike(postId) {
            return await axios.delete(`/api/v1/posts/likes/${postId}/`).catch(error => error)
        }
    }
})
