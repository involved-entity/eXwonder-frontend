<template>
  <div class="header-3xl mb-3">Password reset</div>
  <div class="card md:w-2/5 lg:w-1/3 xl:w-1/4">
    <div class="w-full h-full items-center justify-center mt-3">
      <div class="m-3">
        <p class="form-label">Email:</p>
        <input
            type="email"
            class="form-input" v-model="email"
            @keyup.enter="submit"
        >

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

<script lang="ts">
import {mapStores} from "pinia"
import {useAccountStore} from "../stores/accountStore.ts"

export default {
  data() {
    return {
      email: '',
      loading: false
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
