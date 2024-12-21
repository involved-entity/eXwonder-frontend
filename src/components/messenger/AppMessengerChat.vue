<template>
  <img
    :src="chat!.user.avatar"
    class="rounded-full size-14"
    :alt="chat!.user.username"
  />
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
          }}{{
            chat!.last_message.body.length > maxMessageLen - 1 ? "..." : ""
          }}
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
      w: window.innerWidth as number,
    };
  },
  methods: {
    handleResize() {
      this.w = window.innerWidth;
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
        this.chat!.last_message.sender.id !==
          this.authenticationStore.user.id && !this.chat!.is_read
      );
    },
    isSender() {
      return (
        this.chat!.last_message.sender.id === this.authenticationStore.user.id
      );
    },
    maxMessageLen() {
      if (this.w < 320) {
        return 25;
      } else if (this.w < 375) {
        return 30;
      } else if (this.w < 425) {
        return 36;
      } else if (this.w < 500) {
        return 50;
      } else if (this.w < 640) {
        return 65;
      } else if (this.w < 768) {
        return 75;
      } else if (this.w < 1024) {
        return 90;
      } else if (this.w < 1280) {
        return 20;
      } else {
        return 30;
      }
    },
  },
};
</script>
