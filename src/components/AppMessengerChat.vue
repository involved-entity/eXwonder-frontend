<template>
  <img :src="chat.user.avatar" class="rounded-full size-14" :alt="chat.user.username">
  <div class="ms-2.5 my-auto space-y-1 w-full">
    <div class="flex w-full">
      <div class="text-white font-medium">{{chat.user.username}}</div>
      <div class="text-gray-600 font-medium text-sm ms-auto my-auto">{{chat.last_message.time_added.time_added}}</div>
    </div>
    <div class="flex w-full">
      <div class="text-gray-500 text-sm">{{chat.last_message.body.slice(0, 36)}}{{chat.last_message.body.length > 35 ? '...' : ''}}</div>
      <div class="bg-gray-500 rounded-full ms-auto size-4" v-if="isChatUnread(chat)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {mapStores} from "pinia";
import {useAuthenticationStore} from "../stores/authenticationStore.ts";
import {IChat} from "../types/stores";

export default {
  props: {
    chat: Object
  },
  methods: {
    isChatUnread(chat: IChat) {
      return (chat.last_message.sender.id !== this.authenticationStore.user.id) && !chat.last_message.is_read
    }
  },
  computed: {
    ...mapStores(useAuthenticationStore)
  }
}
</script>
