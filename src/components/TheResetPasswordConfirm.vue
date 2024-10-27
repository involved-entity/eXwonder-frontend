<template>
  <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4" style="background-color: #222">
    <div class="w-full flex h-full items-center justify-center">
      <div class="w-2/3">
        <div class="text-3xl text-center text-gray-300 font-bold mt-1">Password reset confirm</div>
        <div class="m-3">
          <p class="text-lg ms-1 text-gray-300 inline-block">Password:</p><br>
          <input
              type="password"
              placeholder="Your new password"
              class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1" v-model="password1"
          >
          <p><small class="p-1 text-red-600" v-if="error.length">{{error}}</small></p>

          <p class="text-lg ms-1 text-gray-300 inline-block">Password repeat:</p><br>
          <input
              type="password"
              placeholder="Your new password"
              class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1" v-model="password2"
          >
          <p><small class="p-1 text-red-600" v-if="error.length">{{error}}</small></p>

          <button
              type="submit"
              class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
              disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
              @click="submit"
          >Confirm</button>
          <div class="loader my-5 mx-auto" v-if="loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from "pinia";
import {useAuthenticationStore} from "../stores/authenticationStore.js";

export default {
  props: {
    uid: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      password1: '',
      password2: '',
      error: ''
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const message = await this.authenticationStore.resetPasswordConfirm(this.uid, this.token, this.password1, this.password2)
      if (message.length) {
        this.error = message
      }
      this.loading = false
    }
  },
  computed: {
    isValid() {
      return this.password1.length >= 8 && this.password2.length >= 8 && this.password1 === this.password2
    },
    ...mapStores(useAuthenticationStore)
  }
}
</script>
