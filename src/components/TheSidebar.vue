<template>
  <nav class="w-5/6 mt-10 ms-1 xl:ms-3">
    <div class="my-3 flex">
      <img :src="avatar" alt="avatar" class="rounded-full size-8 my-auto">
      <p class="text-gray-300 my-auto ms-1 xl:ms-3 text-sm xl:text-md">{{username}}</p>
      <button
          class="!p-1 my-auto ms-auto btn-no-w btn-green btn-green-hover text-sm xl:text-md"
          @click="logout"
      >Logout</button>
    </div>
    <p class="text-gray-600 montserrat-bold">&#169; 2024 EXWONDER</p>
    <div class="loader mt-5 mx-auto" v-if="loading"></div>
  </nav>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.js"

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
