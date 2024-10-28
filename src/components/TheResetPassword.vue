<template>
  <div class="card">
    <div class="w-full h-full items-center justify-center">
      <div class="header-3xl">Password reset</div>
      <div class="m-3">
        <p class="form-label">Email:</p><br>
        <input
            type="email"
            placeholder="Your email"
            class="form-input" v-model="email"
            :class="{'border-red': errors.email?.length}"
            @keyup.enter="submit"
        >
        <p><small class="form-error-label" v-if="errors.email?.length">{{errors.email}}</small></p>

        <button
            type="submit"
            class="mt-2 btn btn-green btn-green-hover"
            @click="submit"
        >Reset</button>
        <div class="loader my-5 mx-auto" v-if="loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from "pinia";
import {useAccountStore} from "../stores/accountStore.js";

export default {
  data() {
    return {
      email: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      this.loading = true
      await this.accountStore.resetPassword(this.email)
      this.loading = false
    }
  },
  computed: {...mapStores(useAccountStore)}
}
</script>
