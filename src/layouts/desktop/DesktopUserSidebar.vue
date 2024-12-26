<template>
  <nav class="w-5/6 mt-10 ms-1 xl:ms-3">
    <div class="my-3 flex justify-between">
      <div class="flex items-center">
        <img :src="user.avatar" alt="avatar" class="rounded-full size-8 my-auto" />
        <p class="text-gray-700 dark:text-gray-300 my-auto ms-1 xl:ms-3 text-sm xl:text-md">
          {{ user.username }}
        </p>
      </div>
      <button
        class="!p-1 my-auto btn-no-w btn-green btn-green-hover text-sm xl:text-md"
        @click="logout"
      >
        Logout
      </button>
    </div>
    <p class="text-gray-700 dark:text-gray-600 montserrat-bold">&#169; 2024-2025 EXWONDER</p>
    <div class="loader mt-5 mx-auto" v-if="loading"></div>
  </nav>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../../stores/authenticationStore.ts";

export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async logout() {
      this.loading = true;
      await this.authenticationStore.logout();
      this.$router.push({ name: "login" });
      this.loading = false;
    },
  },
  async mounted() {
    await this.authenticationStore.getMe();
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    user() {
      return this.authenticationStore.user;
    },
  },
};
</script>
