import {defineStore} from 'pinia'
import {request} from "../helpers"
import axiosCore from 'axios'

export const usePostsStore = defineStore("posts", {
    actions: {
        async createPost(formData) {
            return await request('post', '/api/v1/posts/posts/', formData, {headers: {'Content-Type': 'multipart/form-data'}}, axiosCore.HttpStatusCode.Created)
        },
        async getUserPosts(username, page = 1) {
            return await request('get', `/api/v1/posts/posts/?user=${username}&page=${page}`)
        },
        async getPostsTop(top = 'updates', page = 1) {
            return await request('get', `/api/v1/posts/posts/?top=${top}&page=${page}`)
        },
        async addPostToSaved(postId) {
            return await request('post', '/api/v1/posts/saved/', {post_id: postId}, null, axiosCore.HttpStatusCode.Created)
        },
        async removePostFromSaved(postId) {
            return await request('delete', `/api/v1/posts/saved/${postId}/`, null, null, axiosCore.HttpStatusCode.NoContent)
        },
        async getSavedPosts(page = 1) {
            return await request('get', `/api/v1/posts/saved/?page=${page}`)
        },
        async deletePost(postId) {
            return await request('delete', `/api/v1/posts/posts/${postId}/`, null, null, axiosCore.HttpStatusCode.NoContent)
        },
        async addPostLike(postId) {
            return await request('post', `/api/v1/posts/post-likes/`, {post_id: postId}, null, axiosCore.HttpStatusCode.Created)
        },
        async deletePostLike(postId) {
            return await request('delete', `/api/v1/posts/post-likes/${postId}/`, null, null, axiosCore.HttpStatusCode.NoContent)
        },
        async getPost(id) {
            return await request('get', `/api/v1/posts/posts/${id}/`)
        }
    }
})
