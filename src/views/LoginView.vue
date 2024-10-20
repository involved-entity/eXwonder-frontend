<template>
  <main>
    <div class="h-screen items-center flex justify-center">
      <div class="border border-gray-300 rounded-2xl w-2/5" style="background-color: #272727">
        <div class="text-3xl text-center text-gray-300 font-bold mt-1">Login</div>
        <div class="m-3">
          <p class="text-lg ms-1 text-gray-300 inline-block">Username:</p><br>
          <input
              type="text"
              placeholder="Your username"
              class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1" v-model="username"
              :class="{'border border-red-600': errors.non_field_errors}"
              @keyup.down="$refs.password_input.focus()"
          >
          <p><small class="p-1 text-red-600" v-if="errors.non_field_errors">{{errors.non_field_errors[0]}}</small></p>

          <p class="text-lg ms-1 text-gray-300 mt-1">Password:</p>
          <input
              type="password"
              placeholder="Your password"
              class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
              v-model="password"
              :class="{'border border-red-600': errors.non_field_errors}"
              @keyup.enter="submit"
              ref="password_input"
          >
          <p><small class="p-1 text-red-600" v-if="errors.non_field_errors">{{errors.non_field_errors[0]}}</small></p>

          <button
              type="submit"
              class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
              disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
              :class="{'hover:bg-violet-950 hover:border hover:border-violet-950': isValid}"
              :disabled="!isValid"
              @click="submit"
          >Login</button>
          <div class="loader my-5 mx-auto" v-if="loading"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.js";
import axios from "axios";

export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const response = await this.authenticationStore.login(this.username, this.password)
        if (response.status === axios.HttpStatusCode.Ok) {
          this.errors = {}
          this.$router.push({name: 'home'})
        } else if (response.status === axios.HttpStatusCode.Accepted) {
          this.errors = {}
          this.$router.push({name: '2fa'})
        } else {
          this.errors = response.response.data
        }
        this.loading = false
      }
    }
  },
  computed: {
    isValid() {
      if (!this.username || this.username.length < 5 || this.username.length > 16) {
        return false
      } else if (!this.password || this.password.length < 8) {
        return false
      }
      return true
    },
    ...mapStores(useAuthenticationStore)
  }
}
</script>
