<template>
  <div class="container" style="border: 15px solid #111; background-color: #272727">
    <div class="justify-center shadow-xl shadow-cyan-500/50">
      <div class="w-full flex h-full items-center justify-center">
        <div class="w-2/3">
          <div class="text-2xl text-center text-gray-300 font-bold mt-1">Change your account password</div>
          <div class="mx-3 mb-3 mt-1">
            <p class="text-lg ms-1 text-gray-300 inline-block">Old password:</p><br>
            <input
                type="password"
                placeholder="Your old password"
                class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                v-model="oldPassword"
                :class="{'border border-red-600': errors.old_password?.length}"
            >
            <p><small class="p-1 text-red-600" v-if="errors.old_password?.length">{{errors.old_password[0]}}</small></p>

            <p class="text-lg ms-1 text-gray-300 mt-1">New password:</p>
            <input
                type="password"
                placeholder="Your new password"
                class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                v-model="newPassword1"
                :class="{'border border-red-600': errors.new_password1?.length}"
            >
            <p><small class="p-1 text-red-600" v-if="errors.new_password1?.length">{{errors.new_password1[0]}}</small></p>

            <p class="text-lg ms-1 text-gray-300 mt-1">New password repeat:</p>
            <input
                type="password"
                placeholder="Your new password repeat"
                class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                v-model="newPassword2"
                :class="{'border border-red-600': errors.new_password2?.length}"
            >
            <p><small class="p-1 text-red-600" v-if="errors.new_password2?.length">{{errors.new_password2[0]}}</small></p>

            <button
                type="submit"
                class="mt-3 py-1 w-full px-3 uppercase font-semibold text-gray-300 rounded bg-green-700 border border-transparent
                disabled:bg-green-800 disabled:text-gray-500 transition-all duration-200"
                :class="{'hover:bg-green-800 hover:border hover:border-green-800': isValid}"
                :disabled="!isValid"
                @click="submit"
            >Change Password</button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from "pinia";
import {useAuthenticationStore} from "../stores/authenticationStore.js";
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errors: {}
    }
  },
  methods: {
    async submit() {
      const response = await this.authenticationStore.changePassword(this.oldPassword, this.newPassword1, this.newPassword2)
      if (response.status !== axios.HttpStatusCode.Ok) {
        this.errors = response.response.data
      } else {
        this.$router.push({name: 'feed'})
      }
    }
  },
  computed: {
    isValid() {
      const oldPassword = this.oldPassword.length >= 8
      const newPassword1 = this.newPassword1.length >= 8
      const newPassword2 = this.newPassword2.length >= 8 && this.newPassword1 === this.newPassword2
      return oldPassword && newPassword1 && newPassword2
    },
    ...mapStores(useAuthenticationStore)
  }
}
</script>
