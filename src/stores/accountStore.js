import {defineStore} from "pinia"
import axiosCore from "axios"
import {useAuthenticationStore} from "./authenticationStore.js"
import {request} from "../helpers"

export const useAccountStore = defineStore('account', {
    actions: {
        async updateSettings(updates) {
            const authenticationStore = useAuthenticationStore()

            const {success, data} = await request('patch', '/api/v1/account/account/update-me/', updates, {
                headers: {'Content-Type': 'multipart/form-data'}
            }, axiosCore.HttpStatusCode.NoContent)

            if (!success) {
                return data
            }

            await authenticationStore.getMe(true)
        },
        async resetPassword(email) {
            return await request('post', '/api/v1/account/password-reset/', {email})
        },
        async resetPasswordConfirm(uid, token, password1, password2) {
            return await request('post', '/api/v1/account/password-reset-confirm/', {
                uid,
                token,
                new_password1: password1,
                new_password2: password2
            })
        },
        async changePassword(oldPassword, newPassword1, newPassword2) {
            return await request('post', '/api/v1/account/password-change/', {
                old_password: oldPassword,
                new_password1: newPassword1,
                new_password2: newPassword2
            })
        }
    }
})
