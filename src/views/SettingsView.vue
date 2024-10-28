<template>
  <div class="container-border">
    <div class="shadow">
      <div class="ps-3 pr-3 pb-5 h-1 pt-3">
        <hr class="border border-gray-600">
      </div>
      <div class="flex ps-3 pr-3 pb-5">
        <img :src="authenticationStore.avatar" alt="avatar" class="min-w-[10rem] size-40">
        <div class="ms-5">
          <p class="form-label">E-mail:</p>
          <input
              type="email"
              :placeholder="authenticationStore.email"
              class="form-input !w-3/4" v-model="email"
              :class="{'border-red': errors.email?.length}"
              @keyup.down="$refs.timezoneInput.focus()"
          >
          <p><small class="form-error-label" v-if="errors.email?.length">{{errors.email[0]}}</small></p>

          <p class="form-label">Time zone:</p>
          <input
              type="text"
              :placeholder="authenticationStore.timezone"
              v-model="timezone"
              class="form-input !w-3/4"
              :class="{'border-red': errors.timezone?.length}"
              @keyup.enter="$refs.is2faEnabled.focus()"
              ref="timezoneInput"
              list="timezones"
          >
          <datalist id="timezones">
            <option v-for="timezone in authenticationStore.availibleTimezones">{{ timezone }}</option>
          </datalist>
          <p><small class="form-error-label" v-if="errors.timezone?.length">{{errors.timezone[0]}}</small></p>

          <p class="form-label">Is 2FA enabled:</p>
          <input
              type="checkbox"
              v-model="is2faEnabled"
              class="w-4 h-4 text-blue-600 rounded bg-gray-custom"
              ref="is2faEnabled"
          >
          <p></p>

          <p class="form-label">Avatar:</p>
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
              class="mt-3 btn-no-w btn-green"
              :class="{'btn-green-hover': isValid}"
              :disabled="!isValid"
              @click="submit"
          >Save & Close</button>
          <router-link :to="{name: 'change-password'}">
            <button
                type="button"
                class="mt-3 ms-3 btn-no-w btn-green btn-green-hover"
            >Change Password</button>
          </router-link>
          <div class="loader my-5 ms-3" v-if="loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from "pinia"
import {useAccountStore} from "../stores/accountStore.js"
import {useAuthenticationStore} from "../stores/authenticationStore.js"

export default {
  data() {
    return {
      loading: false,
      email: '',
      timezone: '',
      is2faEnabled: null,
      avatar: '',
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const data = {email: this.email, timezone: this.timezone, is_2fa_enabled: this.is2faEnabled, avatar: this.avatar}
        const errors = await this.accountStore.updateSettings(data)

        if (errors) {
          this.errors = errors
        } else {
          this.errors = {}
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
    isValid() {
      return this.email !== '' || this.timezone !== '' || this.is2faEnabled !== this.authenticationStore.is2faEnabled || this.avatar !== ''
    },
    ...mapStores(useAccountStore, useAuthenticationStore)
  }
}
</script>
