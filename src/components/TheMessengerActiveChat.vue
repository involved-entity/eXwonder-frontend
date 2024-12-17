<template>
  <div class="flex flex-col relative" style="height: calc(100vh - 45px)">
    <header class="h-14 py-3 bg-gray-200 dark:bg-neutral-800">
      <div class="font-semibold text-xl ms-5 text-white my-auto cursor-pointer" @click="this.$router.push({name: 'user', params: {'username': messengerStore.activeChat.user.username}})">{{messengerStore.activeChat.user.username}}</div>
    </header>
    <div class="flex-1 overflow-y-auto">
      <div class="relative ms-5 mt-3">
        <AppMessengerMessege :message="message" v-for="message in messengerStore.messages.toReversed()" :key="message.id" />
      </div>
    </div>
    <footer class="h-28 bg-gray-200 dark:bg-neutral-800">
      <label for="chat" class="sr-only">Your message</label>
      <div class="flex items-center space-x-1 py-2 px-3">
        <div class="relative">
          <input
              type="file"
              @change="attachmentChanged"
              class="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#151515]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
            </svg>
          </button>
        </div>
        <textarea
            id="chat"
            rows="1"
            v-model="message"
            @keyup.ctrl.enter="sendMessage"
            class="peer py-3 px-4 block w-full bg-gray-100 dark:bg-[#151515] border-transparent rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Your message..."
        ></textarea>
        <button
            type="submit"
            class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-[#151515]"
            @click="sendMessage"
        >
          <svg class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import {mapStores} from "pinia";
import {useMessengerStore} from "../stores/messengerStore.ts";
import AppMessengerMessege from "../components/AppMessengerMessege.vue";

export default {
  components: {AppMessengerMessege},
  data() {
    return {
      message: '' as string,
      attachment: undefined as File | undefined
    }
  },
  methods: {
    updateChat() {
      this.messengerStore.clearMessages()
      this.messengerStore.getChatHistory(this.messengerStore.activeChat.id)
    },
    attachmentChanged(event: Event) {
      this.attachment = event.target!.files[0];
    },
    sendMessage() {
      if (this.isValid) {
        this.messengerStore.sendMessage(this.messengerStore.activeChat.id, this.messengerStore.activeChat.user.id, this.message, this.attachment)
        this.message = ''
        this.attachment = undefined
      }
    }
  },
  mounted() {
    this.updateChat()
  },
  watch: {
    'messengerStore.activeChat'() {
      this.updateChat()
    }
  },
  computed: {
    ...mapStores(useMessengerStore),
    isValid() {
      return (this.message.length > 0 && this.message.length <= 4096) || (this.attachment)
    }
  }
}
</script>
