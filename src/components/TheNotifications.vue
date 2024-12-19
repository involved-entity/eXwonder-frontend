<template>
  <div class="relative cursor-pointer">
    <div class="overflow-hidden" @click="showDropdown">
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 28 28"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7 text-black dark:hidden"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          fill="currentColor"
          class="size-7 hidden dark:block dark:text-white"
        >
          <path
            fill-rule="evenodd"
            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <div
          class="absolute top-0 right-1 bg-red-600 rounded-full size-3 text-white"
          v-if="accountStore.notifications.length"
        ></div>
      </div>
    </div>
    <div
      class="absolute -end-[120px] z-10 mt-3 w-60 rounded-lg bg-gray-200 dark:bg-[#181818] shadow-lg shadow-slate-900/50"
      role="menu"
      ref="notificationsDropdown"
      v-if="show && accountStore.notifications.length"
    >
      <div class="p-2">
        <div
          class="block rounded-lg py-2 text-xs text-center text-gray-500 hover:bg-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#151515] dark:hover:text-gray-300"
          @click="markAllRead"
        >
          Mark all read
        </div>
        <div
          class="block rounded-lg px-2 py-2 text-xs text-gray-500 hover:bg-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#151515] dark:hover:text-gray-300"
          role="menuitem"
          v-for="notification in accountStore.notifications"
          :key="notification.id"
          @click="checkNotification(notification)"
        >
          <div class="flex w-full space-x-1">
            <div class="w-1/5">
              <img
                :src="notification.receiver.avatar"
                alt="avatar"
                class="rounded-full max-w-full"
              />
            </div>
            <div class="w-4/5 flex items-center">
              <div>
                <span class="link">
                  {{ notification.receiver.username }}
                </span>
                creates new post<br />
                <span
                  class="text-gray-600 dark:text-gray-400 text-[11px] montserrat"
                  >{{ notification.time_added.time_added }} ago</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAccountStore } from "../stores/accountStore.ts";
import { mapStores } from "pinia";
import { initSocketConnection } from "../helpers";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { INotification } from "../types/globals";

export default {
  data() {
    return {
      show: false as boolean,
      isDropdownClosable: false as boolean,
    };
  },
  methods: {
    closeDropdown() {
      this.show = false;
      this.isDropdownClosable = false;
      document.body.removeEventListener("click", this.handleClick);
    },
    showDropdown() {
      if (this.accountStore.notifications.length) {
        this.show = true;
        document.body.addEventListener("click", this.handleClick);
      }
    },
    checkNotification(notification: INotification) {
      this.markRead(notification.id);
      this.closeDropdown();
      this.$router.push("/" + notification.receiver.username + "/");
    },
    markRead(id: number) {
      const data = JSON.stringify({
        type: "mark_read",
        id,
      });
      this.authenticationStore.socket!.send(data);
      this.accountStore.notifications = this.accountStore.notifications.filter(
        notification => notification.id !== id
      );
    },
    markAllRead() {
      const data = JSON.stringify({
        type: "mark_all_read",
      });
      this.authenticationStore.socket!.send(data);
      this.accountStore.notifications = [];
      this.closeDropdown();
    },
    handleClick(event: Event) {
      if (this.show && this.isDropdownClosable) {
        const dropdown = this.$refs.notificationsDropdown;
        if (!dropdown.contains(event.target)) {
          this.closeDropdown();
        }
      } else {
        this.isDropdownClosable = true;
      }
    },
  },
  mounted() {
    initSocketConnection();
  },
  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },
  computed: { ...mapStores(useAccountStore, useAuthenticationStore) },
};
</script>
