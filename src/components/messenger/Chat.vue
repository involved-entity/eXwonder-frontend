<template>
  <img :src="chat!.user.avatar" class="rounded-full size-14" :alt="chat!.user.username" />
  <div class="ms-2.5 my-auto space-y-1 w-full">
    <div class="flex w-full">
      <div class="text-default font-medium">{{ chat!.user.username }}</div>
      <div class="text-default-700 font-medium text-sm ms-auto my-auto">
        {{ chatTimeAdded }}
      </div>
    </div>
    <div class="flex w-full">
      <div class="flex space-x-1 items-center">
        <div class="text-default text-sm" v-if="isSender">You:</div>
        <div class="text-default-800 text-sm">
          {{ chat!.last_message.body.slice(0, maxMessageLen)
          }}{{ chat!.last_message.body.length > maxMessageLen - 1 ? "..." : "" }}
        </div>
      </div>
      <div
        class="bg-gray-300 dark:bg-gray-500 rounded-full ms-auto size-4"
        v-if="isChatUnread"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../../stores/authenticationStore.ts";
import { messengerFormatDate } from "../../helpers";

export default {
  props: {
    chat: Object,
  },
  data() {
    return {
      windowSize: window.innerWidth as number,
    };
  },
  methods: {
    handleResize() {
      this.windowSize = window.innerWidth;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    chatTimeAdded() {
      return messengerFormatDate(this.chat!.last_message.time_added.time_added);
    },
    isChatUnread() {
      return (
        this.chat!.last_message.sender.id !== this.authenticationStore.user.id &&
        !this.chat!.is_read
      );
    },
    isSender() {
      return this.chat!.last_message.sender.id === this.authenticationStore.user.id;
    },
    maxMessageLen() {
      const breakpoints = [
        { maxWidth: 320, length: 25 },
        { maxWidth: 375, length: 30 },
        { maxWidth: 425, length: 36 },
        { maxWidth: 500, length: 50 },
        { maxWidth: 640, length: 65 },
        { maxWidth: 768, length: 75 },
        { maxWidth: 1024, length: 90 },
        { maxWidth: 1280, length: 20 },
        { maxWidth: Infinity, length: 30 },
      ];

      for (const breakpoint of breakpoints) {
        if (this.windowSize < breakpoint.maxWidth) {
          return breakpoint.length;
        }
      }

      return 30;
    },
  },
};
</script>
