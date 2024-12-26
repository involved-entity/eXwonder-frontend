<template>
  <div class="flex relative" v-if="!fullWidth">
    <div class="w-3/12 fixed top-0 left-0 hidden lg:block" v-if="authenticationStore.isAuth">
      <DesktopNavSidebar />
    </div>
    <div
      class="w-3/12 fixed top-0 right-0 hidden lg:block mt-[44px]"
      v-if="authenticationStore.isAuth"
    >
      <DesktopUserSidebar />
    </div>
    <TopToolbar />
    <div
      :class="{
        'w-full m-auto lg:w-6/12 pb-14 lg:pb-0 mt-[45px]': authenticationStore.isAuth,
        'w-full': !authenticationStore.isAuth,
      }"
    >
      <RouterView />
    </div>
    <div class="w-full fixed bottom-0 left-0 block lg:hidden" v-if="authenticationStore.isAuth">
      <MobileNavSidebar />
    </div>
  </div>
  <div class="flex relative" v-if="fullWidth">
    <TopToolbar />
    <div class="w-full mt-[45px] h-full">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import DesktopNavSidebar from "./layouts/desktop/DesktopNavSidebar.vue";
import DesktopUserSidebar from "./layouts/desktop/DesktopUserSidebar.vue";
import MobileNavSidebar from "./layouts/mobile/MobileNavSidebar.vue";
import TopToolbar from "./layouts/TopToolbar.vue";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "./stores/authenticationStore.ts";

export default {
  components: { DesktopUserSidebar, DesktopNavSidebar, MobileNavSidebar, TopToolbar },
  computed: {
    ...mapStores(useAuthenticationStore),
    fullWidth() {
      return this.$route.meta.fullWidth;
    },
  },
};
</script>
