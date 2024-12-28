<template>
  <div class="m-2 w-full grid grid-cols-8">
    <RouterLink
      :to="{ name: 'user', params: { username: post.author.username } }"
      class="col-span-1 remove-active"
    >
      <img :src="post.author.avatar" alt="avatar" class="w-11 h-11 rounded-full mx-auto" />
    </RouterLink>
    <div class="ms-3 col-span-6">
      <div class="flex" :class="{ 'h-full items-center': !post.signature.length }">
        <RouterLink
          :to="{ name: 'user', params: { username: post.author.username } }"
          class="hover:text-gray-600 text-sm dark:hover:text-gray-400 remove-active"
        >
          {{ post.author.username }}
        </RouterLink>
        <p class="text-gray-600 dark:text-gray-400 text-[13px] ms-2 montserrat">
          {{ post.time_added.time_added }} ago
        </p>
      </div>
      <div
        class="text-gray-600 dark:text-gray-500 text-sm"
        v-if="post.signature.length && post.signature.length <= 100"
      >
        {{ post.signature }}
      </div>
      <div
        class="text-gray-600 dark:text-gray-500 text-sm cursor-pointer"
        v-if="post.signature.length && post.signature.length > 100"
        @click="signatureExpanded = !signatureExpanded"
      >
        {{ signatureExpanded ? post.signature : post.signature.slice(0, 32) }}
        <span class="text-white" v-if="!signatureExpanded">...</span>
      </div>
    </div>
    <div class="col-span-1 justify-end">
      <PostSaveButton :post="post" />
    </div>
  </div>
</template>

<script lang="ts">
import PostSaveButton from "../../PostSaveButton.vue";
import { IPost } from "../../../types/globals";

export default {
  name: "PostBasicInfo",
  components: { PostSaveButton },
  props: {
    post: {
      type: Object as () => IPost,
      required: true,
    },
  },
  data() {
    return {
      signatureExpanded: false,
    };
  },
};
</script>
