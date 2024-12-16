<template>
  <nav
    class="shadow-theme-toggler w-full fixed top-0 left-0 h-[44px] flex justify-center items-center bg-gray-100 dark:bg-[#222] z-10"
    id="theme-toggler"
  >
    <div
        class="absolute left-5 top-1/2 transform -translate-y-1/2 h-full flex items-center cursor-pointer"
        :class="{'hidden': this.$route.name !== 'messenger'}"
        @click="$router.go(-1)"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-black dark:text-white"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </div>
    <div
      class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 h-full flex justify-center items-center"
    >
      <button
        class="text-black dark:text-white"
        type="button"
        @click="toggleTheme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 28 28"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
          v-if="theme === 'light'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-7" v-if="theme === 'dark'">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div
      class="space-x-1 flex w-full lg:mr-5 lg:justify-center"
      v-if="authenticationStore.isAuth"
    >
      <div class="ml-auto lg:ml-0 my-auto lg:w-6/12">
        <div class="flex justify-end space-x-1">
          <TheMessengerButton/>
          <TheNotifications />
        </div>
      </div>
      <div class="ml-auto block lg:hidden">
        <TheMobileSidebar />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import TheMobileSidebar from "../layouts/TheMobileSidebar.vue";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { mapStores } from "pinia";
import TheNotifications from "../components/TheNotifications.vue";
import TheMessengerButton from "../components/TheMessengerButton.vue";

export default {
  components: {TheMessengerButton, TheNotifications, TheMobileSidebar },
  data() {
    return {
      theme: "dark",
    };
  },
  methods: {
    toggleTheme() {
      const currentTheme = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", currentTheme ? "dark" : "light");
      this.theme = currentTheme ? "dark" : "light";
    },
  },
  beforeMount() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      this.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
    }
  },
  computed: { ...mapStores(useAuthenticationStore) },
};
</script>
