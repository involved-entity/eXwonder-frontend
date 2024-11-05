<template>
  <main class="relative">
    <div class="hw-centered flex flex-col">
      <div class="header-3xl mb-3">Login</div>
      <div class="card">
        <div class="w-full h-full items-center justify-center mt-3">
          <div class="mx-3 mb-3">
            <p class="form-label">Username:</p>
            <input
                type="text"
                class="form-input" v-model="username"
                :class="{'border-red': errors.non_field_errors.length}"
                @keyup.down="$refs.passwordInput.focus()"
            >
            <p><small class="form-error-label" v-if="errors.non_field_errors.length">{{errors.non_field_errors[0]}}</small></p>

            <p class="form-label mt-1">Password:</p>
            <input
                type="password"
                class="form-input"
                v-model="password"
                :class="{'border-red': errors.non_field_errors.length}"
                @keyup.enter="submit"
                ref="passwordInput"
            >
            <p><small class="form-error-label" v-if="errors.non_field_errors.length">{{errors.non_field_errors[0]}}</small></p>

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
      <div class="mx-auto">Don't have an account? <router-link :to="{name: 'sing-up'}" class="link">Sing up</router-link></div>
      <div class="mx-auto">Forgive your password? <router-link :to="{name: 'reset-password'}" class="link">Reset password</router-link></div>
    </div>
  </main>
  <div class="relative">
    <div class="fixed left-5 top-5">
      <app-alert message="Success sing up." v-if="$route.query.action === 'sing-up'"/>
    </div>
  </div>
</template>

<script lang="ts">
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.ts"
import AppAlert from "../components/AppAlert.vue";

export default {
  components: {AppAlert},
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errors: {non_field_errors: []}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const {success, data} = await this.authenticationStore.login(this.username, this.password)

        if (success && data.code === 'CODE_SENDED') {
          this.errors = {non_field_errors: []}
          this.authenticationStore.sessionKey = data.session_key
          this.$router.push({name: '2fa', query: {'action': 'login'}})
        } else if (success) {
          this.errors = {non_field_errors: []}
          localStorage.setItem('token', data.token)
          this.authenticationStore.token = data.token
          this.authenticationStore.isAuth = true
          this.$router.push({name: 'feed', query: {'action': 'login'}})
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
