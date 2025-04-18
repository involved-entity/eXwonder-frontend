<template>
  <nav
    class="shadow-theme-toggler w-full fixed top-0 left-0 h-[44px] flex justify-center items-center bg-[#222] z-10"
    id="theme-toggler"
  >
    <div
      class="absolute left-5 top-1/2 transform -translate-y-1/2 h-full flex items-center cursor-pointer"
      :class="{ hidden: $route.name !== 'messenger' }"
      @click="goBack"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6 text-white"
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
      <button class="text-white" type="button" @click="toggleTheme">
        <svg
          v-if="theme === 'light'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 28 28"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <svg
          v-if="theme === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-7"
        >
          <path
            fill-rule="evenodd"
            d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      class="absolute right-5 top-1/2 cursor-pointer transform -translate-y-1/2 h-full hidden lg:block"
    >
      <div
        class="flex space-x-3 items-center h-full"
        :class="{ hidden: $route.name !== 'messenger' }"
      >
        <img
          :src="authenticationStore.user.avatar"
          alt="avatar"
          class="rounded-full size-7"
          @click="goToUserProfile"
        />
        <button class="!p-1 btn-no-w btn-green btn-green-hover text-sm xl:text-md" @click="logout">
          Logout
        </button>
      </div>
    </div>
    <div class="space-x-1 flex w-full lg:mr-5 lg:justify-center" v-if="authenticationStore.isAuth">
      <div class="ml-auto lg:ml-0 my-auto lg:w-6/12">
        <div class="flex justify-end space-x-1">
          <NavigateButton />
          <NotificationsComponent />
        </div>
      </div>
      <div class="ml-auto block lg:hidden">
        <MobileNavDrawer />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import MobileNavDrawer from "./mobile/MobileNavDrawer.vue";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { useMessengerStore } from "../stores/messengerStore.ts";
import { mapStores } from "pinia";
import NotificationsComponent from "../components/NotificationsComponent.vue";
import NavigateButton from "../components/messenger/NavigateButton.vue";

export default {
  components: { NavigateButton, NotificationsComponent, MobileNavDrawer },
  data() {
    return {
      theme: "dark",
      windowSize: window.innerWidth,
    };
  },
  methods: {
    toggleTheme() {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      this.theme = isDark ? "dark" : "light";
    },
    async logout() {
      await this.authenticationStore.logout();
      this.$router.push({ name: "login" });
    },
    goBack() {
      this.backButtonToMessenger
        ? (this.messengerStore.activeChat = undefined)
        : this.$router.go(-1);
    },
    goToUserProfile() {
      this.$router.push({
        name: "user",
        params: { username: this.authenticationStore.user.username },
      });
    },
    handleResize() {
      this.windowSize = window.innerWidth;
    },
  },
  beforeMount() {
    const savedTheme = localStorage.getItem("theme");
    this.theme = savedTheme === "light" ? "light" : "dark";
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapStores(useAuthenticationStore, useMessengerStore),
    backButtonToMessenger() {
      return this.windowSize < 1024 && this.messengerStore.activeChat;
    },
  },
};
</script>
