<template>
  <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4" style="background-color: #222">
    <div class="w-full flex h-full items-center justify-center">
      <div class="w-2/3">
        <div class="text-3xl text-center text-gray-300 font-bold mt-1">Password reset</div>
        <div class="m-3">
          <p class="text-lg ms-1 text-gray-300 inline-block">Email:</p><br>
          <input
              type="email"
              placeholder="Your email"
              class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1" v-model="email"
              :class="{'border border-red-600': errors.email?.length}"
          >
          <p><small class="p-1 text-red-600" v-if="errors.email?.length">{{errors.email}}</small></p>

          <button
              type="submit"
              class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
              disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
              @click="submit"
          >Reset</button>
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
  data() {
    return {
      email: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      this.loading = true
      await this.authenticationStore.resetPassword(this.email)
      this.loading = false
    }
  },
  computed: {...mapStores(useAuthenticationStore)}
}
</script>
