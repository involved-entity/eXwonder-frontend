<template>
  <main class="relative">
    <div class="hw-centered">
      <div class="card">
        <div class="w-full h-full items-center justify-center">
          <div class="header-3xl">Sing Up</div>
          <div class="mx-3 mb-3 mt-1">
            <p class="form-label">Username:</p>
            <input
                type="text"
                placeholder="Your username"
                class="form-input"
                :class="{'border-red': errors.username}"
                v-model="username"
                @keyup.down="$refs.emailInput.focus()"
            >
            <p><small class="form-error-label" v-if="errors.username">{{errors.username[0]}}</small></p>

            <p class="form-label">Email:</p>
            <input
                type="email"
                placeholder="Your email (optional)"
                class="form-input"
                :class="{'border-red': errors.email}"
                v-model="email"
                ref="emailInput"
                @keyup.down="$refs.password1Input.focus()"
            >
            <p><small class="form-error-label" v-if="errors.email">{{errors.email[0]}}</small></p>

            <p class="form-label">Password:</p>
            <input
                type="password"
                placeholder="Your password"
                class="form-input"
                v-model="password1"
                ref="password1Input"
                @keyup.down="$refs.password2Input.focus()"
            >

            <p class="form-label">Password repeat:</p>
            <input
                type="password"
                placeholder="Repeat your password"
                class="form-input"
                v-model="password2"
                ref="password2Input"
                @keyup.enter="submit"
            >

            <button
                type="submit"
                class="mt-2 btn btn-green"
                :class="{'btn-gree-hover': isValid}"
                @click="submit"
                :disabled="!isValid"
            >Sing Up</button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-link-9">
      Already have an account? <router-link :to="{name: 'login'}" class="link">Log in</router-link>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from '../stores/authenticationStore.js'

export default {
  data() {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const {success, data} = await this.authenticationStore.singUp(this.username, this.password1, this.email.length ? this.email : null)

        if (success) {
          this.errors = {}
          this.$router.push({name: 'login', query: {'action': 'sing-up'}})
        } else {
          this.errors = data
        }

        this.loading = false
      }
    }
  },
  computed: {
    isValid() {
      if (this.username.length < 5 && this.username.length > 16) {
        return false
      }
      return !((!this.password1 || this.password1.length < 8) ||
          (!this.password2 || this.password2.length < 8) ||
          (this.password1 !== this.password2));
    },
    ...mapStores(useAuthenticationStore)
  }
}
</script>
