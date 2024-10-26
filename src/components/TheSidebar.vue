<template>
  <nav class="w-4/5 mt-10 ms-3">
    <div class="my-3 flex">
      <img :src="avatar" alt="avatar" class="rounded-full size-8 my-auto">
      <p class="text-gray-300 text-lg my-auto ms-3">{{username}}</p>
      <button
          class="p-1 uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
                 my-auto ms-auto hover:bg-violet-950 hover:border hover:border-violet-950"
          @click="logout"
      >Logout</button>
    </div>
    <p class="text-gray-600">&#169; 2024 EXWONDER</p>
    <div class="loader mt-5 mx-auto" v-if="loading"></div>
  </nav>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.js";

export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async logout() {
      this.loading = true
      await this.authenticationStore.logout()
      this.$router.push({name: 'login'})
      this.loading = false
    },
    async updateSidebar() {
      await this.authenticationStore.getMe()
    }
  },
  async mounted() {
    await this.updateSidebar()
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    username() {return this.authenticationStore.username},
    avatar() {return this.authenticationStore.avatar},
  }
}
</script>
