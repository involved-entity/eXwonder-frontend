<template>
  <div class="flex">
    <div class="w-1/5 fixed top-0 left-0" v-if="authenticationStore.isAuth">
      <the-navbar></the-navbar>
    </div>
    <div class="w-1/5 fixed top-0 right-0" v-if="authenticationStore.isAuth">
      <the-sidebar></the-sidebar>
    </div>
    <div :class="{
      'w-3/5': authenticationStore.isAuth, 'w-full': !authenticationStore.isAuth,
      'm-auto': authenticationStore.isAuth
    }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheNavbar from "./components/TheNavbar.vue";
import TheSidebar from "./components/TheSidebar.vue";
import {mapStores} from 'pinia'
import {useAuthenticationStore} from './stores/authenticationStore.js'

export default {
  components: {TheSidebar, TheNavbar},
  computed: {
    ...mapStores(useAuthenticationStore)
  }
}
</script>
