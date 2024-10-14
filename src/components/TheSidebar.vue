<template>
  <main>
    <div style="border: 15px solid #111; background-color: #272727">
      <div class="justify-center shadow-xl shadow-cyan-500/50">
        <img :src="avatar" alt="avatar" class="rounded-full w-1/2 h-1/2 m-auto my-3">
        <p class="text-gray-300 text-xl text-center">{{username}}</p>
        <div class="ms-3 mr-3 pb-3">
          <button
              class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
                     hover:bg-violet-950 hover:border hover:border-violet-950"
              @click="logout"
          >Logout</button>
          <div class="loader mt-5 mb-3 mx-auto" v-if="loading"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from "../stores/authenticationStore.js";
import BaseUrl from "../settings.js";

export default {
  data() {
    return {
      id: 0,
      username: null,
      avatar: null,
      loading: false
    }
  },
  methods: {
    async logout() {
      this.loading = true
      await this.authenticationStore.logout()
      this.$router.push({name: 'login'})
      this.loading = false
    }
  },
  async mounted() {
    const {id, username, avatar} = await this.authenticationStore.getMe()
    this.id = id
    this.username = username
    this.avatar = BaseUrl + avatar
  },
  computed: {
    ...mapStores(useAuthenticationStore)
  }
}
</script>
