<template>
  <main>
    <div class="h-screen items-center flex justify-center gap-x-5">
      <app-description :links="['login']"/>
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
import AppDescription from "../components/AppDescription.vue";

export default {
  components: {AppDescription},
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
        const {success, data} = await this.authenticationStore.twoFactorAuthentication(this.code)
        if (success) {
          this.errors = {}
          this.$router.push({name: 'feed'})
        } else {
          this.errors.code = data.detail
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
