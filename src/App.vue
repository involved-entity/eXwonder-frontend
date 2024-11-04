<template>
  <div class="flex relative">
    <div class="w-3/12 fixed top-0 left-0 hidden lg:block" v-if="authenticationStore.isAuth">
      <the-navbar/>
    </div>
    <div class="w-3/12 fixed top-0 right-0 hidden lg:block" v-if="authenticationStore.isAuth">
      <the-sidebar/>
    </div>
    <div :class="{
      'w-full lg:w-6/12': authenticationStore.isAuth, 'w-full': !authenticationStore.isAuth,
      'm-auto': authenticationStore.isAuth
    }">
      <router-view/>
    </div>
    <div class="w-full fixed bottom-0 left-0 block lg:hidden" v-if="authenticationStore.isAuth">
      <the-bottom-navbar/>
    </div>
  </div>
</template>

<script lang="ts">
import TheNavbar from "./components/TheNavbar.vue"
import TheSidebar from "./components/TheSidebar.vue"
import TheBottomNavbar from "./components/TheBottomNavbar.vue"
import {mapStores} from 'pinia'
import {useAuthenticationStore} from './stores/authenticationStore.ts'

export default {
  components: {TheSidebar, TheNavbar, TheBottomNavbar},
  computed: {...mapStores(useAuthenticationStore)}
}
</script>
