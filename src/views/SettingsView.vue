<template>
  <div class="container" style="border: 15px solid #111; background-color: #272727">
    <div class="shadow-xl shadow-cyan-500/50">
      <div class="text-center text-gray-300 font-bold text-3xl">
        Settings
      </div>
      <div class="ps-3 pr-3 pb-5 h-1">
        <hr class="border border-gray-600">
      </div>
      <div class="flex ps-3 pr-3 pb-5">
        <img :src="authenticationStore.avatar" alt="avatar" class="min-w-[9rem] size-36">
        <div class="ms-5">
          <p class="text-lg ms-1 text-gray-300 inline-block">E-mail:</p><br>
          <input
              type="email"
              :placeholder="authenticationStore.email"
              class="text-gray-400 bg-gray-custom w-3/4 p-1 outline-none rounded mt-1" v-model="email"
              :class="{'border border-red-600': errors.email?.length}"
              @keyup.down="$refs.timezoneInput.focus()"
          >
          <p><small class="p-1 text-red-600" v-if="errors.email?.length">{{errors.email[0]}}</small></p>

          <p class="text-lg ms-1 text-gray-300 mt-3">Time zone:</p>
          <input
              type="text"
              :placeholder="authenticationStore.timezone"
              v-model="timezone"
              class="text-gray-400 bg-gray-custom w-3/4 p-1 outline-none rounded mt-1"
              :class="{'border border-red-600': errors.timezone?.length}"
              @keyup.enter="$refs.is2faEnabled.focus()"
              ref="timezoneInput"
              list="timezones"
          >
          <datalist id="timezones">
            <option v-for="timezone in authenticationStore.availibleTimezones">{{ timezone }}</option>
          </datalist>
          <p><small class="p-1 text-red-600" v-if="errors.timezone?.length">{{errors.timezone[0]}}</small></p>

          <p class="text-lg ms-1 text-gray-300 mt-3">Is 2FA enabled:</p>
          <input
              type="checkbox"
              v-model="is2faEnabled"
              class="w-4 h-4 text-blue-600 rounded bg-gray-custom"
              ref="is2faEnabled"
          >
          <p></p>

          <p class="text-lg ms-1 text-gray-300 mt-3">Avatar:</p>
          <input
              class="px-1 w-3/4 text-lg text-gray-400 border border-gray-300 rounded-lg cursor-pointer
              bg-gray-50 focus:outline-none file:bg-slate-600 file:border-slate-600 file:text-gray-950"
              type="file"
              ref="images"
              style="background-color: #202020; border-color: #202020"
              @change="avatarChanged"
          >

          <button
              type="submit"
              class="mt-3 py-1 px-3 uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
              disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
              :class="{'hover:bg-violet-950 hover:border hover:border-violet-950': isValid}"
              :disabled="!isValid"
              @click="submit"
          >Save & Close</button>
          <div class="loader my-5 ms-3" v-if="loading"></div>
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
      loading: false,
      email: '',
      timezone: '',
      is2faEnabled: null,
      avatar: '',
      errors: []
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const data = {email: this.email, timezone: this.timezone, is_2fa_enabled: this.is2faEnabled, avatar: this.avatar}
        const errors = await this.authenticationStore.updateSettings(data)
        if (errors) {
          this.errors = errors
        } else {
          this.errors = []
          this.$router.push('/' + this.authenticationStore.username + "/")
        }
        this.loading = false
      }
    },
    avatarChanged(event) {
      this.avatar = event.target.files[0]
    }
  },
  mounted() {
    this.is2faEnabled = this.authenticationStore.is2faEnabled
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    isValid() {
      return this.email !== '' || this.timezone !== '' || this.is2faEnabled !== this.authenticationStore.is2faEnabled || this.avatar !== ''
    }
  }
}
</script>
