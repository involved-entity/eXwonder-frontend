<template>
  <div class="flex gap-x-2 sm:gap-x-3" v-if="!isSender">
    <img
      class="inline-block size-9 rounded-full cursor-pointer"
      @click="
        $router.push({
          name: 'user',
          params: { username: message.sender.username },
        })
      "
      :src="message.sender.avatar"
      :alt="message.sender.username"
    />
    <TheMessengerMessageBody :message="message" />
  </div>
  <div class="flex justify-end sm:mr-3 gap-x-2 sm:gap-x-3" v-else>
    <TheMessengerMessageBody :message="message" :isSender="isSender" />
    <img
      class="inline-block size-9 rounded-full cursor-pointer"
      @click="
        $router.push({
          name: 'user',
          params: { username: message.sender.username },
        })
      "
      :src="message.sender.avatar"
      :alt="message.sender.username"
    />
  </div>
</template>

<script lang="ts">
import TheMessengerMessageBody from "./TheMessengerMessageBody.vue";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

export default {
  components: { TheMessengerMessageBody },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    isSender() {
      return this.authenticationStore.user.id === this.message.sender.id;
    },
  },
};
</script>
