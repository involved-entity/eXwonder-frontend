import { defineStore } from "pinia";
import { Methods, request } from "../helpers";
import axios from "axios";
import { IResponse } from "../types/helpers";

export const useCommentsStore = defineStore("comments", {
  actions: {
    async getPostComments(
      postId: number,
      page: number = 1
    ): Promise<IResponse> {
      return await request(
        Methods.GET,
        `/api/v1/posts/comments/?post_id=${postId}&page=${page}`
      );
    },
    async addComment(postId: number, comment: string): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/posts/comments/",
        { post_id: postId, comment },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async deleteComment(commentId: number): Promise<IResponse> {
      return await request(
        Methods.DELETE,
        `/api/v1/posts/comments/${commentId}/`,
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
    async addCommentLike(commentId: number): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/posts/comment-likes/",
        { comment_id: commentId },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async deleteCommentLike(commentId: number): Promise<IResponse> {
      return await request(
        Methods.DELETE,
        `/api/v1/posts/comment-likes/${commentId}/`,
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
  },
});
