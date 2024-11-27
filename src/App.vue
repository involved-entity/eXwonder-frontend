<template>
  <div class="flex relative">
    <div
      class="w-3/12 fixed top-0 left-0 hidden lg:block"
      v-if="authenticationStore.isAuth"
    >
      <the-navbar />
    </div>
    <div
      class="w-3/12 fixed top-0 right-0 hidden lg:block mt-[44px]"
      v-if="authenticationStore.isAuth"
    >
      <the-sidebar />
    </div>
    <the-theme-toggler></the-theme-toggler>
    <div
      :class="{
        'w-full m-auto lg:w-6/12 pb-14 lg:pb-0 mt-[45px]':
          authenticationStore.isAuth,
        'w-full': !authenticationStore.isAuth,
      }"
    >
      <router-view />
    </div>
    <div
      class="w-full fixed bottom-0 left-0 block lg:hidden"
      v-if="authenticationStore.isAuth"
    >
      <the-bottom-navbar />
    </div>
  </div>
</template>

<script lang="ts">
import TheNavbar from "./components/TheNavbar.vue";
import TheSidebar from "./components/TheSidebar.vue";
import TheBottomNavbar from "./components/TheBottomNavbar.vue";
import TheThemeToggler from "./components/TheThemeToggler.vue";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "./stores/authenticationStore.ts";

export default {
  components: { TheSidebar, TheNavbar, TheBottomNavbar, TheThemeToggler },
  computed: { ...mapStores(useAuthenticationStore) },
};
</script>
