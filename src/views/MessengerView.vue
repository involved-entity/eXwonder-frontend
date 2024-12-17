<template>
  <div class="w-full" style="height: calc(100vh - 45px)">
    <div class="w-[30%] border-r border-neutral-600 h-full overflow-y-hidden transition-all duration-150 hover:overflow-y-auto overflow-x-hidden relative">
      <div class="h-1/6 px-3 py-5 sticky top-0 left-0 bg-gray-100 dark:bg-[#151515] shadow-lg shadow-gray-900/50 z-10">
        <div class="relative">
          <input
              type="text"
              class="peer py-3 px-4 block w-full bg-gray-200 border-transparent rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Search chat"
          >
        </div>
      </div>
      <div>
        <div class="text-white hover:bg-transparent/20 w-full px-3 flex relative py-3" v-for="chat in messengerStore.chats" :key="chat.id">
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
        </div>
      </div>
    </div>
    <div class="w-[70%]"></div>
  </div>
</template>

<script lang="ts">
import {useMessengerStore} from "../stores/messengerStore.ts";
import {mapStores} from "pinia";

export default {
  computed: {...mapStores(useMessengerStore)}
}
</script>
