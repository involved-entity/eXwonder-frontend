import {defineStore} from "pinia"
import {request} from "../helpers"
import axiosCore from 'axios'

export const useCommentsStore = defineStore("comments", {
    actions: {
        async getPostComments(postId) {
            return await request('get', `/api/v1/posts/comments/?post_id=${postId}`)
        },
        async addComment(postId, comment) {
            return await request('post', '/api/v1/posts/comments/', {post_id: postId, comment}, null, axiosCore.HttpStatusCode.Created)
        },
        async deleteComment(commentId) {
            return await request('delete', `/api/v1/posts/comments/${commentId}/`, null, null, axiosCore.HttpStatusCode.NoContent)
        },
        async addCommentLike(commentId) {
            return await request('post', '/api/v1/posts/comment-likes/', {comment_id: commentId}, null, axiosCore.HttpStatusCode.Created)
        },
        async deleteCommentLike(commentId) {
            return await request('delete', `/api/v1/posts/comment-likes/${commentId}/`, null, null, axiosCore.HttpStatusCode.NoContent)
        }
    }
})
