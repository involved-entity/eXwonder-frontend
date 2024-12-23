<template>
  <div class="flex gap-x-2 sm:gap-x-3" v-if="!isSender">
    <img
      class="inline-block size-9 rounded-full cursor-pointer"
      @click="navigateToUser"
      :src="message.sender.avatar"
      :alt="message.sender.username"
    />
    <MessageBody :message="message" />
  </div>
  <div class="flex justify-end sm:mr-3 gap-x-2 sm:gap-x-3" v-else>
    <MessageBody
      :message="message"
      :isSender="true"
      @deleteMessage="messengerStore.markMessageDelete"
      @editMessage="emitEditMessage"
    />
    <img
      class="inline-block size-9 rounded-full cursor-pointer"
      @click="navigateToUser"
      :src="message.sender.avatar"
      :alt="message.sender.username"
    />
  </div>
</template>

<script lang="ts">
import MessageBody from "./MessageBody.vue";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../../stores/authenticationStore.ts";
import { useMessengerStore } from "../../stores/messengerStore.ts";

import { IMessage } from "@/types/globals";

export default {
  emits: ["editMessage"],
  components: { MessageBody },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitEditMessage(message: IMessage) {
      this.$emit("editMessage", message);
    },
    navigateToUser() {
      this.$router.push({
        name: "user",
        params: { username: this.message.sender.username },
      });
    },
  },
  computed: {
    ...mapStores(useAuthenticationStore, useMessengerStore),
    isSender() {
      return this.authenticationStore.user.id === this.message.sender.id;
    },
  },
};
</script>
