<template>
  <div class="w-full flex" style="height: calc(100vh - 45px)">
    <div
      class="w-[28%] border-r border-neutral-600 h-full overflow-y-hidden transition-all duration-150 hover:overflow-y-auto overflow-x-hidden relative"
    >
      <div
        class="h-1/6 px-3 py-5 sticky top-0 left-0 bg-gray-100 dark:bg-[#151515] shadow-lg shadow-gray-900/50 z-10"
      >
        <div class="relative">
          <input
            type="text"
            class="peer py-3 px-4 block w-full bg-gray-200 border-transparent rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Search chat"
            v-model="search"
          />
        </div>
      </div>
      <div>
        <div class="pt-5" v-if="searchLoading">
          <div class="loader mx-auto"></div>
        </div>
        <div
          class="text-gray-600 dark:text-gray-500 pt-5"
          v-if="!searchLoading && search.length && !searchResults.length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-24 mx-auto"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-center text-2xl">No results found :/</div>
        </div>

        <div v-if="!searchLoading && !search.length">
          <div
            class="text-white hover:bg-transparent/20 w-full px-3 flex relative py-3 cursor-pointer"
            v-for="chat in messengerStore.chats"
            :key="chat.id"
            @click="openChat(chat)"
          >
            <AppMessengerChat
              :chat="chat"
              v-if="chat.last_message.time_added"
            />
            <AppMessengerEmptyChat
              :user="chat.user"
              v-if="!chat.last_message.time_added"
            />
          </div>
        </div>

        <div
          v-if="
            !searchLoading &&
            search.length &&
            searchResults.length &&
            searchMode === searchModeEnum.CHATS
          "
        >
          <div
            class="text-white hover:bg-transparent/20 w-full px-3 flex relative py-3 cursor-pointer"
            v-for="chat in searchResults"
            :key="chat.id"
            @click="openChat(chat)"
          >
            <AppMessengerChat
              :chat="chat"
              v-if="chat.last_message.time_added"
            />
            <AppMessengerEmptyChat
              :user="chat.user"
              v-if="!chat.last_message.time_added"
            />
          </div>
        </div>

        <div
          v-if="
            !searchLoading &&
            search.length &&
            searchResults.length &&
            searchMode === searchModeEnum.USERS
          "
        >
          <div
            class="text-white hover:bg-transparent/20 w-full px-3 flex relative py-3 cursor-pointer"
            v-for="user in searchResults"
            :key="user.id"
            @click="openChat(user, true)"
          >
            <AppMessengerEmptyChat :user="user" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-[72%] h-full overflow-y-auto overflow-x-hidden">
      <TheMessengerActiveChat v-if="messengerStore.activeChat" />
    </div>
  </div>
</template>

<script lang="ts">
import { useMessengerStore } from "../stores/messengerStore.ts";
import { useUsersStore } from "../stores/usersStore.ts";
import { mapStores } from "pinia";
import { IChat } from "../types/stores";
import AppMessengerChat from "../components/AppMessengerChat.vue";
import { IUserExtendedData } from "../types/globals";
import TheMessengerActiveChat from "../components/TheMessengerActiveChat.vue";
import AppMessengerEmptyChat from "../components/AppMessengerEmptyChat.vue";

enum SearchMode {
  CHATS = "chats",
  USERS = "users",
}

export default {
  components: {
    AppMessengerEmptyChat,
    TheMessengerActiveChat,
    AppMessengerChat,
  },
  data() {
    return {
      search: "" as string,
      searchMode: undefined as SearchMode | undefined,
      searchModeEnum: SearchMode,
      searchResults: [] as Array<IChat> | Array<IUserExtendedData>,
      searchLoading: false as boolean,
    };
  },
  methods: {
    openChat(chatOrUser: IChat | IUserExtendedData, start: boolean = false) {
      if (start) {
        this.messengerStore.startChat(chatOrUser as IUserExtendedData);
        this.search = "";
        this.searchResults = [];
        this.searchMode = undefined;
      } else {
        if (this.messengerStore.activeChat !== chatOrUser) {
          this.messengerStore.changeActiveChat(chatOrUser as IChat);
        }
      }
    },
  },
  beforeRouteLeave() {
    this.messengerStore.activeChat = undefined;
  },
  watch: {
    async search() {
      this.searchLoading = true;
      const res = this.messengerStore.chats.filter(chat =>
        chat.user.username.toLowerCase().includes(this.search.toLowerCase())
      );
      if (res.length) {
        this.searchResults = res;
        this.searchMode = SearchMode.CHATS;
      } else if (this.search.length >= 3) {
        this.searchResults = await this.usersStore.searchUsers(this.search);
        this.searchMode = SearchMode.USERS;
      } else {
        this.searchResults = [];
        this.searchMode = undefined;
      }
      this.searchLoading = false;
    },
  },
  computed: { ...mapStores(useMessengerStore, useUsersStore) },
};
</script>
