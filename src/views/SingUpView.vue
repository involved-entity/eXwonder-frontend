<template>
  <main class="relative">
    <div class="hw-centered flex flex-col">
      <div class="header-3xl mb-3">Sing Up</div>
      <div class="card text-md w-3/4 sm:w-2/5 lg:w-1/3">
        <div class="w-full h-full items-center justify-center mt-3">
          <div class="mx-3 mb-3">
            <p class="form-label">Username:</p>
            <input
                type="text"
                class="form-input"
                :class="{'border-red': errors.username}"
                v-model="username"
                @keyup.down="$refs.emailInput.focus()"
            >
            <p><small class="form-error-label" v-if="errors.username">{{errors.username[0]}}</small></p>

            <p class="form-label">Email <code class="text-slate-500">(optional)</code>:</p>
            <input
                type="email"
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
                class="form-input"
                v-model="password1"
                ref="password1Input"
                @keyup.down="$refs.password2Input.focus()"
            >

            <p class="form-label">Password repeat:</p>
            <input
                type="password"
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
    <div class="footer-link-9 flex flex-col">
      <div class="mx-auto">Already have an account? <router-link :to="{name: 'login'}" class="link">Log in</router-link></div>
    </div>
  </main>
</template>

<script lang="ts">
import {mapStores} from 'pinia'
import {useAuthenticationStore} from '../stores/authenticationStore.ts'

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
