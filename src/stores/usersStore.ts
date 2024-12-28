import { defineStore } from "pinia";
import { Methods, request } from "../helpers";
import axios from "axios";

import { IUserExtendedData } from "../types/globals";
import { IResponse } from "../types/helpers";

export const useUsersStore = defineStore("users", {
  actions: {
    async getUser(username: string): Promise<IResponse> {
      return await request(Methods.GET, `/api/v1/account/user/?username=${username}&fields=all`);
    },
    async getUserFollowings(userId: number, page: number = 1, search?: string): Promise<IResponse> {
      let url = `/api/v1/account/followings/user/${userId}/?page=${page}`;
      if (search) {
        url = url + `&search=${search}`;
      }
      return await request(Methods.GET, url);
    },
    async follow(userId: number): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/account/followings/",
        { following: userId },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async disfollow(userId: number): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/account/followings/disfollow/",
        { following: userId },
        undefined,
        axios.HttpStatusCode.NoContent
      );
    },
    async searchUsers(usernameQuery: string): Promise<Array<IUserExtendedData>> {
      const { data } = await request(
        Methods.GET,
        `/api/v1/account/account/?search=${usernameQuery}`
      );
      return data.results;
    },
    async getMyFollowers(): Promise<IResponse> {
      return await request(Methods.GET, "/api/v1/account/followers/");
    },
  },
});
