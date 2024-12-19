<template>
  <div class="flex relative" v-if="!fullWidth">
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
  <div class="flex relative" v-if="fullWidth">
    <the-theme-toggler></the-theme-toggler>
    <div class="w-full mt-[45px] h-full">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import TheNavbar from "./layouts/TheNavbar.vue";
import TheSidebar from "./layouts/TheSidebar.vue";
import TheBottomNavbar from "./layouts/TheBottomNavbar.vue";
import TheThemeToggler from "./layouts/TheThemeToggler.vue";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "./stores/authenticationStore.ts";

export default {
  components: { TheSidebar, TheNavbar, TheBottomNavbar, TheThemeToggler },
  computed: {
    ...mapStores(useAuthenticationStore),
    fullWidth() {
      return this.$route.meta.fullWidth;
    },
  },
};
</script>
