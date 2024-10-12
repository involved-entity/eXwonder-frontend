<template>
  <div class="flex">
    <div class="w-1/5" v-if="authenticationStore.isAuth">
      <the-navbar></the-navbar>
    </div>
    <div :class="{'w-3/5': authenticationStore.isAuth, 'w-full': !authenticationStore.isAuth}">
      <router-view></router-view>
    </div>
    <div class="w-1/5" v-if="authenticationStore.isAuth">

    </div>
  </div>
</template>

<script>
import TheNavbar from "./components/TheNavbar.vue";
import {mapStores} from 'pinia'
import {useAuthenticationStore} from './stores/authenticationStore.js'

export default {
  components: {TheNavbar},
  computed: {
    ...mapStores(useAuthenticationStore)
  }
}
</script>
