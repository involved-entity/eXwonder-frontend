<template>
  <img :src="chat.user.avatar" class="rounded-full size-[72px]" :alt="chat.user.username">
  <div class="ms-2.5 my-auto space-y-2 w-full">
    <div class="flex w-full">
      <div class="text-white font-semibold text-lg">{{chat.user.username}}</div>
      <div class="text-gray-600 font-medium text-sm ms-auto my-auto">{{chat.last_message.time_added.time_added}}</div>
    </div>
    <div class="flex w-full">
      <div class="text-gray-500">{{chat.last_message.body.slice(0, 32)}}{{chat.last_message.body.length > 31 ? '...' : ''}}</div>
      <div class="bg-gray-500 rounded-full ms-auto size-4" v-if="!chat.last_message.is_read"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    chat: Object
  }
}
</script>
