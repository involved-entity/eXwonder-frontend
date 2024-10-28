<template>
  <main class="relative">
    <div class="hw-centered">
      <div class="card">
        <div class="w-full h-full items-center justify-center">
          <div class="header-3xl">Login</div>
          <div class="mx-3 mb-3 mt-1">
            <p class="form-label">Username:</p><br>
            <input
                type="text"
                placeholder="Your username"
                class="form-input" v-model="username"
                :class="{'border-red': errors.non_field_errors}"
                @keyup.down="$refs.password_input.focus()"
            >
            <p><small class="form-error-label" v-if="errors.non_field_errors">{{errors.non_field_errors[0]}}</small></p>

            <p class="form-label mt-1">Password:</p>
            <input
                type="password"
                placeholder="Your password"
                class="form-input"
                v-model="password"
                :class="{'border-red': errors.non_field_errors}"
                @keyup.enter="submit"
                ref="password_input"
            >
            <p><small class="form-error-label" v-if="errors.non_field_errors">{{errors.non_field_errors[0]}}</small></p>

            <button
                type="submit"
                class="mt-2 btn btn-green"
                :class="{'btn-green-hover': isValid}"
                :disabled="!isValid"
                @click="submit"
            >Login</button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-link-16 flex flex-col">
      <span class="mx-auto">Don't have an account? <router-link :to="{name: 'sing-up'}" class="link">Sing up</router-link></span>
      <span>Forgive your password? <router-link :to="{name: 'reset-password'}" class="link">Reset password</router-link></span>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.js";
import axios from "axios";
import AppDescriptionComponent from "../components/AppDescription.vue";

export default {
  components: {AppDescriptionComponent},
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
        const {success, data} = await this.authenticationStore.login(this.username, this.password)
        if (success && data.code === 'CODE_SENDED') {
          this.errors = {}
          this.authenticationStore.sessionKey = data.session_key
          this.$router.push({name: '2fa'})
        } else if (success) {
          this.errors = {}
          localStorage.setItem('token', data.token)
          this.authenticationStore.token = data.token
          this.authenticationStore.isAuth = true
          this.$router.push({name: 'feed'})
        } else {
          this.errors = data
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
