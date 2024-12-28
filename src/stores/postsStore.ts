import { defineStore } from "pinia";
import { Methods, request } from "../helpers";
import axios from "axios";
import { IResponse } from "../types/helpers";
import { Tops } from "../types/globals";

export const usePostsStore = defineStore("posts", {
  actions: {
    async createPost(post: FormData): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/posts/posts/",
        post,
        { headers: { "Content-Type": "multipart/form-data" } },
        axios.HttpStatusCode.Created
      );
    },
    async getUserPosts(username: string, page: number = 1): Promise<IResponse> {
      return await request(Methods.GET, `/api/v1/posts/posts/?user=${username}&page=${page}`);
    },
    async getPostsTop(top: Tops = Tops.UPDATES, page: number = 1): Promise<IResponse> {
      return await request(Methods.GET, `/api/v1/posts/posts/?top=${top}&page=${page}`);
    },
    async addPostToSaved(postId: number): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/posts/saved/",
        { post_id: postId },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async removePostFromSaved(postId: number): Promise<IResponse> {
      return await request(
        Methods.DELETE,
        `/api/v1/posts/saved/${postId}/`,
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
    async getSavedPosts(page: number = 1): Promise<IResponse> {
      return await request(Methods.GET, `/api/v1/posts/saved/?page=${page}`);
    },
    async deletePost(postId: number): Promise<IResponse> {
      return await request(
        Methods.DELETE,
        `/api/v1/posts/posts/${postId}/`,
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
    async addPostLike(postId: number): Promise<IResponse> {
      return await request(
        Methods.POST,
        `/api/v1/posts/post-likes/`,
        { post_id: postId },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async deletePostLike(postId: number): Promise<IResponse> {
      return await request(
        Methods.DELETE,
        `/api/v1/posts/post-likes/${postId}/`,
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
    async getPost(postId: number): Promise<IResponse> {
      return await request(Methods.GET, `/api/v1/posts/posts/${postId}/`);
    },
  },
});
