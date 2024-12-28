<template>
  <div class="relative cursor-pointer">
    <div class="overflow-hidden" @click="toggleDropdown">
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          fill="currentColor"
          class="size-7 block text-white"
        >
          <path
            fill-rule="evenodd"
            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <div
          class="absolute top-0 right-1 bg-red-600 rounded-full size-3 text-white"
          v-if="notifsStore.notifications.length"
        ></div>
      </div>
    </div>
    <div
      class="absolute -end-[120px] z-10 mt-3 w-60 rounded-lg bg-gray-200 dark:bg-[#181818] shadow-lg shadow-slate-900/50"
      role="menu"
      ref="notificationsDropdown"
      v-if="show && notifsStore.notifications.length"
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
          v-for="notification in notifsStore.notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
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
                <span class="link">{{ notification.receiver.username }}</span>
                creates new post<br />
                <span class="text-gray-600 dark:text-gray-400 text-[11px] montserrat">
                  {{ notification.time_added.time_added }} ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useNotificationsStore } from "../stores/notificationsStore.ts";
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
    toggleDropdown() {
      if (this.notifsStore.notifications.length) {
        this.show = !this.show;
        this.show
          ? document.body.addEventListener("click", this.handleClick)
          : document.body.removeEventListener("click", this.handleClick);
      }
    },
    handleNotificationClick(notification: INotification) {
      this.notifsStore.markRead(notification.id);
      this.$router.push("/" + notification.receiver.username + "/");
      this.closeDropdown();
    },
    markAllRead() {
      this.notifsStore.markAllRead();
      this.closeDropdown();
    },
    closeDropdown() {
      this.show = false;
      this.isDropdownClosable = false;
      document.body.removeEventListener("click", this.handleClick);
    },
    handleClick(event: Event) {
      const dropdown = this.$refs.notificationsDropdown;
      if (this.show && this.isDropdownClosable && !dropdown.contains(event.target)) {
        this.closeDropdown();
      } else {
        this.isDropdownClosable = true;
      }
    },
  },
  mounted() {
    this.notifsStore.initNotifications();
  },
  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },
  computed: {
    ...mapStores(useNotificationsStore, useAuthenticationStore),
  },
};
</script>
