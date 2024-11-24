<template>
  <div class="container-border" @keyup.enter="submit">
    <div class="shadow">
      <div class="ps-3 pr-3 pb-3 h-1 pt-3">
        <hr class="border border-gray-600">
      </div>
      <div class="lg:flex ps-3 pr-3 pb-5">
        <img :src="authenticationStore.user.avatar" alt="avatar" class="min-w-[10rem] mx-auto lg:mx-0 size-40">
        <div class="mx-auto max-w-3/4">
          <p class="form-label mt-1">E-mail:</p>
          <input
              type="email"
              :placeholder="authenticationStore.user.email"
              class="form-input" v-model="email"
              :class="{'border-red': errors.email?.length}"
              ref="emailInput"
              @keyup.down="$refs.timezoneInput.focus()"
          >
          <p><small class="form-error-label" v-if="errors.email?.length">{{errors.email[0]}}</small></p>

          <p class="form-label mt-3">Time zone:</p>
          <input
              type="text"
              :placeholder="authenticationStore.user.timezone"
              v-model="timezone"
              class="form-input"
              :class="{'border-red': errors.timezone?.length}"
              @keyup.up="$refs.emailInput.focus()"
              @keyup.down="$refs.is2faEnabled.focus()"
              ref="timezoneInput"
              list="timezones"
          >
          <datalist id="timezones">
            <option v-for="timezone in authenticationStore.availibleTimezones">{{ timezone }}</option>
          </datalist>
          <p><small class="form-error-label" v-if="errors.timezone?.length">{{errors.timezone[0]}}</small></p>

          <p class="form-label mt-3">Is 2FA enabled:</p>
          <input
              type="checkbox"
              v-model="is2faEnabled"
              class="w-4 h-4 text-blue-600 rounded bg-gray-custom"
              ref="is2faEnabled"
          >
          <p></p>

          <p class="form-label mt-3">Avatar:</p>
          <input
              class="px-1 text-lg text-gray-400 border border-gray-300 rounded-lg cursor-pointer
              bg-gray-50 focus:outline-none file:bg-slate-600 file:border-slate-600 file:text-gray-950"
              type="file"
              ref="images"
              style="background-color: #202020; border-color: #202020"
              @change="avatarChanged"
          >
          <div class="w-full">
            <div class="flex w-full">
              <button
                  type="submit"
                  class="mt-3 btn-no-w btn-green mr-auto"
                  :class="{'btn-green-hover': isValid}"
                  :disabled="!isValid"
                  @click="submit"
              >Save & Close</button>
              <router-link :to="{name: 'change-password'}">
                <button
                    type="button"
                    class="mt-3 ml-auto btn lg:btn-no-w btn-green btn-green-hover"
                >Change Password</button>
              </router-link>
            </div>
            <button
                class="!p-1 my-auto ms-auto btn btn-green btn-green-hover text-sm xl:text-md mt-1 block lg:hidden"
                @click="logout"
            >Logout</button>
          </div>
          <div class="loader my-5 mx-auto lg:ms-3" v-if="loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {mapStores} from "pinia"
import {useAccountStore} from "../stores/accountStore.ts"
import {useAuthenticationStore} from "../stores/authenticationStore.ts"
import {useRouteStore} from "../stores/routeStore.ts"

export default {
  data() {
    return {
      loading: false,
      email: '',
      timezone: '',
      is2faEnabled: undefined as boolean | undefined,
      avatar: undefined as File | undefined,
      errors: {email: [], timezone: []}
    }
  },
  methods: {
    async logout() {
      this.loading = true
      await this.authenticationStore.logout()
      this.routeStore.changeActiveLink('feed')
      this.$router.push({name: 'login'})
      this.loading = false
    },

    async submit() {
      if (this.isValid) {
        this.loading = true
        const data = {email: this.email, timezone: this.timezone, is_2fa_enabled: this.is2faEnabled, avatar: this.avatar}
        const errors: Record<string, Array<string>> | undefined = await this.accountStore.updateSettings(data)

        if (!errors) {
          this.errors = {email: [], timezone: []}
          this.routeStore.changeActiveLink('user')
          this.$router.push({path: '/' + this.authenticationStore.user.username + "/", query: {'action': 'settings'}})
        } else {
          this.errors.email = errors.email
          this.errors.timezone = errors.timezone
        }

        this.loading = false
      }
    },
    avatarChanged(event) {
      this.avatar = event.target.files[0]
    }
  },
  mounted() {
    this.is2faEnabled = this.authenticationStore.user.is2faEnabled
  },
  computed: {
    isValid() {
      return this.email !== '' || this.timezone !== '' || this.is2faEnabled !== this.authenticationStore.user.is2faEnabled || this.avatar
    },
    ...mapStores(useAccountStore, useAuthenticationStore, useRouteStore)
  }
}
</script>
