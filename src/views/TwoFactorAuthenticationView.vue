<template>
  <main>
    <div class="h-screen items-center flex justify-center gap-x-5">
      <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4 relative" style="background-color: #222">
        <div class="text-3xl text-center text-gray-300 font-bold mt-1">Welcome to eXwonder!</div>
        <div class="m-3">
          <p class="text-lg ms-1 text-gray-400 inline-block">
            Simple image hosting. Features:<br><br>

            1. Adding posts with images and captions (up to 10)<br>
            2. Likes and comments<br>
            3. Saving posts<br>
            4. Top posts by likes and date added<br>
            5. Subscriptions<br>
            6. News feed<br>
            7. Extensive account settings<br>
          </p>
        </div>
        <div class="absolute bottom-0 left-0 w-full">
          <p class="text-xl text-gray-300 mx-3 mb-1">Dont have an account?
            <router-link :to="{name: 'sing-up'}" class="border-b border-gray-300 hover:border-blue-600 hover:text-blue-600">Sing up</router-link>
          </p>
        </div>
      </div>
      <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4" style="background-color: #222">
        <div class="w-full flex h-full items-center justify-center">
          <div class="w-2/3">
            <div class="text-3xl text-center text-gray-300 font-bold mt-1">2FA</div>
            <div class="m-3">
              <p class="text-lg ms-1 text-gray-300 inline-block">Code:</p><br>
              <input
                  type="text"
                  placeholder="2FA code (sended to your email)"
                  class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1" v-model="code"
                  :class="{'border border-red-600': errors.code?.length}"
                  @keyup.enter="submit"
              >
              <p><small class="p-1 text-red-600" v-if="errors.code?.length">{{errors.code}}</small></p>

              <button
                  type="submit"
                  class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
              disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
                  :class="{'hover:bg-violet-950 hover:border hover:border-violet-950': isValid}"
                  :disabled="!isValid"
                  @click="submit"
              >Submit</button>
              <div class="loader my-5 mx-auto" v-if="loading"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from "pinia";
import {useAuthenticationStore} from "../stores/authenticationStore.js";
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      code: '',
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        const response = await this.authenticationStore.twoFactorAuthentication(this.code)
        if (response.status === axios.HttpStatusCode.Ok) {
          this.errors = {}
          this.$router.push({name: 'feed'})
        } else {
          this.errors.code = response.response.data.detail
        }
      }
    }
  },
  computed: {
    isValid() {return this.code.length === 5},
    ...mapStores(useAuthenticationStore)
  }
}
</script>
