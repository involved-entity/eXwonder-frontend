<template>
  <div class="card">
    <div class="w-full h-full items-center justify-center">
      <div class="header-3xl">Confirm</div>
      <div class="m-3">
        <p class="form-label">Password:</p>
        <input
            type="password"
            placeholder="Your new password"
            class="form-input" v-model="password1"
            @keyup.down="$refs.repeat.focus()"
        >
        <p><small class="form-error-label" v-if="error.length">{{error}}</small></p>

        <p class="form-label">Password repeat:</p>
        <input
            type="password"
            placeholder="Your new password"
            class="form-input" v-model="password2"
            ref="repeat"
            @keyup.enter="submit"
        >
        <p><small class="form-error-label" v-if="error.length">{{error}}</small></p>

        <button
            type="submit"
            class="mt-2 btn btn-green"
            :class="{'btn-green-hover': isValid}"
            :disabled="!isValid"
            @click="submit"
        >Confirm</button>
        <div class="loader my-5 mx-auto" v-if="loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from "pinia"
import {useAccountStore} from "../stores/accountStore.js"

export default {
  props: {
    uid: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      password1: '',
      password2: '',
      error: ''
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const {success, data} = await this.accountStore.resetPasswordConfirm(this.uid, this.token, this.password1, this.password2)
      if (!success) {
        if (data.new_password2?.length) {
          this.error = 'Password is too common.'
        }
        this.error = 'Token is invalid. Please retry to reset password.'
      } else {
        this.$router.push({name: 'login'})
      }
      this.loading = false
    }
  },
  computed: {
    isValid() {
      return this.password1.length >= 8 && this.password2.length >= 8 && this.password1 === this.password2
    },
    ...mapStores(useAccountStore)
  }
}
</script>
