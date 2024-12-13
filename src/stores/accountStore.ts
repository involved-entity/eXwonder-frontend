import { defineStore } from "pinia";
import axios, { AxiosResponse } from "axios";
import { useAuthenticationStore } from "./authenticationStore.ts";
import { Methods, request } from "../helpers";
import { IUserSettingsUpdates } from "../types/stores";
import { IResponse } from "../types/helpers";
import { INotification } from "../types/globals";

export const useAccountStore = defineStore("account", {
  state() {
    return {
      notifications: [] as Array<INotification>,
    };
  },
  actions: {
    async updateSettings(
      updates: IUserSettingsUpdates
    ): Promise<
      undefined | AxiosResponse<Record<string, Array<string>>>["data"]
    > {
      const authenticationStore = useAuthenticationStore();

      const { success, data } = await request(
        Methods.PATCH,
        "/api/v1/account/account/update-me/",
        updates,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        axios.HttpStatusCode.NoContent
      );

      if (!success) {
        return data;
      }

      await authenticationStore.getMe(true);
      return undefined;
    },
    async resetPassword(email: string): Promise<IResponse> {
      return await request(Methods.POST, "/api/v1/account/password-reset/", {
        email,
      });
    },
    async resetPasswordConfirm(
      uid: string,
      token: string,
      password1: string,
      password2: string
    ): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/account/password-reset-confirm/",
        {
          uid,
          token,
          new_password1: password1,
          new_password2: password2,
        }
      );
    },
    async changePassword(
      oldPassword: string,
      newPassword1: string,
      newPassword2: string
    ): Promise<IResponse> {
      return await request(Methods.POST, "/api/v1/account/password-change/", {
        old_password: oldPassword,
        new_password1: newPassword1,
        new_password2: newPassword2,
      });
    },
  },
});
