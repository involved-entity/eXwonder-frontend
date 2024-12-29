<template>
  <div class="w-full flex" style="height: calc(100vh - 45px)">
    <SplitterGroup v-if="showActiveChatWindow" direction="horizontal">
      <SplitterPanel
        :defaultSize="28"
        :maxSize="50"
        :minSize="28"
        class="h-full scrollable overflow-y-auto lg:overflow-y-hidden transition-all duration-150 lg:hover:overflow-y-auto overflow-x-hidden relative bg-gray-100 dark:bg-[#151515]"
      >
        <ChatsList />
      </SplitterPanel>
      <SplitterResizeHandle class="w-1" />
      <SplitterPanel
        :defaultSize="72"
        :maxSize="72"
        :minSize="50"
        class="h-full overflow-y-auto overflow-x-hidden"
      >
        <ActiveChat />
      </SplitterPanel>
    </SplitterGroup>
    <div class="flex w-full" v-else>
      <div
        class="h-full scrollable overflow-y-auto lg:overflow-y-hidden transition-all duration-150 lg:hover:overflow-y-auto overflow-x-hidden relative bg-gray-100 dark:bg-[#151515]"
        :class="{ 'w-full': !messengerStore.activeChat, 'w-0': messengerStore.activeChat }"
      >
        <ChatsList />
      </div>
      <div
        class="h-full overflow-y-auto overflow-x-hidden"
        :class="{ 'w-full': messengerStore.activeChat }"
      >
        <ActiveChat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMessengerStore } from "../stores/messengerStore.ts";
import { mapStores } from "pinia";
import ActiveChat from "../components/messenger/ActiveChat.vue";
import ChatsList from "../components/messenger/ChatsList.vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

export default {
  components: {
    ActiveChat,
    ChatsList,
    SplitterGroup,
    SplitterPanel,
    SplitterResizeHandle,
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
  beforeRouteLeave() {
    this.messengerStore.activeChat = undefined;
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapStores(useMessengerStore),
    showActiveChatWindow() {
      return this.windowSize >= 1024;
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

.scrollable {
  scrollbar-width: thin;
  scrollbar-color: #555 transparent;
}
</style>
