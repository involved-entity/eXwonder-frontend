<template>
  <img :src="user.avatar" class="rounded-full size-14" :alt="user.username" />
  <div class="ms-2.5 my-auto space-y-1 w-full">
    <div class="flex w-full">
      <div class="text-default font-medium">{{ user.username }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { IUserDefaultData } from "../../types/globals";

export default {
  props: {
    user: {
      type: Object as () => IUserDefaultData,
      required: true,
    },
  },
};
</script>
