<template>
  <div class="relative" style="height: calc(100vh - 45px)">
    <div class="flex flex-col relative" style="height: calc(100vh - 45px)" v-if="messengerStore.activeChat">
      <header class="h-14 text-default relative bg-gray-100 dark:bg-[#151515]">
        <div
          class="font-medium dark:font-semibold flex flex-col space-y-0 text-xl absolute left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-5 top-1/2 -translate-y-1/2 cursor-pointer"
          @click="
          $router.push({
            name: 'user',
            params: { username: messengerStore.activeChat!!.user.username },
          })
        "
        >
          <div class="">{{ messengerStore.activeChat!.user.username }}</div>
          <div class="flex">
            <button
              type="button"
              class="px-1.5 uppercase font-semibold rounded poppins transition-all duration-300 text-gray-300 bg-emerald-700 text-sm inline-flex disabled:bg-emerald-800 disabled:text-gray-500"
              :disabled="!messengerStore.activeChat!.user.is_online"
              :class="{ 'mx-auto': showOnlineStatusCenter }"
            >
              {{ messengerStore.activeChat!.user.is_online ? "online" : "offline" }}
            </button>
          </div>
        </div>
        <div class="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer z-50">
          <div class="m-auto">
            <DeleteDropdown
              caption="Delete chat"
              @delete="messengerStore.markChatDelete(messengerStore.activeChat!)"
            />
          </div>
        </div>
      </header>
      <div
        class="flex-1 overflow-y-auto scrollable bg-transparent/10 dark:bg-transparent/20"
        ref="scrollContainer"
        v-if="getMessages.length"
      >
        <div class="relative ms-5 mt-3">
          <div class="mb-1" v-for="message in getMessages" :key="message.id">
            <div
              class="mt-1.5 mb-2.5 w-[10.25rem] mx-auto"
              v-if="isDatesInDifferentDays(activeDay, message.time_added.time_added)"
            >
              <div
                class="rounded-xl flex items-center justify-center text-sm py-1 px-3 bg-black/30 text-white"
              >
                {{ getDateByTimeAdded(message.time_added.time_added) }}
              </div>
            </div>
            <Message :message="message" @editMessage="editMessage" />
          </div>
        </div>
      </div>
      <div class="flex-1 bg-transparent/10 dark:bg-transparent/20 h-full relative" v-else>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex items-center justify-center text-sm py-1 px-3 bg-black/30 text-white">
          Write first message
        </div>
      </div>
      <footer class="h-28 bg-gray-100 dark:bg-[#151515]">
        <label for="chat" class="sr-only">Your message</label>
        <div class="flex items-center space-x-1 py-2 px-3">
          <div
            class="relative cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full"
          >
            <input type="file" @change="attachmentChanged" class="absolute inset-0 opacity-0" />
            <button
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </button>
          </div>
          <textarea
            id="chat"
            rows="1"
            v-model="message"
            @keyup.ctrl.enter="sendMessage"
            class="peer py-3 px-4 block w-full bg-gray-200 dark:bg-neutral-800 border-transparent rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Your message..."
          ></textarea>
          <button
            type="submit"
            class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800"
            @click="sendMessage"
          >
            <svg
              class="w-6 h-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
          </button>
        </div>
      </footer>
    </div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex items-center justify-center text-sm py-1 px-3 bg-black/30 text-white" v-else>
      Select chat to open here
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useMessengerStore } from "../../stores/messengerStore.ts";
import Message from "./Message.vue";
import { parseDate } from "../../helpers";
import DeleteDropdown from "../DeleteDropdown.vue";

import { IMessage } from "../../types/globals";

export default {
  components: { DeleteDropdown, Message },
  data() {
    return {
      message: "" as string,
      attachment: undefined as File | undefined,
      activeDay: "00:00 01.01.1917" as string,
      messageEdit: undefined as number | undefined,
    };
  },
  methods: {
    updateChat() {
      this.messengerStore.getChatHistory();
      this.messengerStore.markChatRead();
    },
    attachmentChanged(event: Event) {
      this.attachment = event.target!.files[0];
    },
    editMessage(message: IMessage) {
      this.messageEdit = message.id;
      this.message = message.body;
    },
    sendMessage() {
      if (this.isValid) {
        if (this.messageEdit) {
          this.messengerStore.editMessage(this.messageEdit, this.message, this.attachment as File);
          this.messageEdit = undefined;
        } else {
          this.messengerStore.sendMessage(
            this.messengerStore.activeChat!.id,
            this.messengerStore.activeChat!.user.id,
            this.message,
            this.attachment as File
          );
        }
        this.resetMessage();
      }
    },
    resetMessage() {
      this.message = "";
      this.attachment = undefined;
    },
    isDatesInDifferentDays(dateStr1: string, dateStr2: string): boolean {
      const date1 = parseDate(dateStr1);
      const date2 = parseDate(dateStr2);
      const res =
        date1.getFullYear() !== date2.getFullYear() || date1.getDate() !== date2.getDate();
      this.activeDay = res ? dateStr2 : dateStr1;
      return res;
    },
    getDateByTimeAdded(timeAdded: string) {
      const date = timeAdded.split(" ")[1].split(".");
      const monthNames = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return [date[0], monthNames[+date[1] - 1], date[2]].join(" ");
    },
  },
  watch: {
    "messengerStore.activeChat"(newChat, oldChat) {
      if (newChat && newChat !== oldChat) {
        this.updateChat();
      }
    },
  },
  computed: {
    ...mapStores(useMessengerStore),
    isValid() {
      return (this.message.length > 0 && this.message.length <= 4096) || this.attachment;
    },
    getMessages() {
      return this.messengerStore.messages
        .filter(message => message.chat === this.messengerStore.activeChat!.id)
        .toReversed();
    },
    showOnlineStatusCenter() {
      return window.innerWidth < 1024;
    },
  },
};
</script>
