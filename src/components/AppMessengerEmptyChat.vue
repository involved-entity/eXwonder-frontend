<template>
  <img :src="user.avatar" class="rounded-full size-14" :alt="user.username">
  <div class="ms-2.5 my-auto space-y-1 w-full">
    <div class="flex w-full">
      <div class="text-white font-medium">{{user.username}}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    user: Object
  }
}
</script>
