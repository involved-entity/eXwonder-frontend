<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :fill="post.is_saved ? 'currentColor' : 'none'"
    viewBox="0 0 24 24"
    :stroke-width="post.is_saved ? '0' : '1.5'"
    stroke="currentColor"
    class="size-6 cursor-pointer"
    @click="toggleSavePost"
  >
    <path
      :d="
        post.is_saved
          ? 'M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z'
          : 'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z'
      "
      stroke-linecap="round"
      stroke-linejoin="round"
      :fill-rule="post.is_saved ? 'evenodd' : undefined"
      :clip-rule="post.is_saved ? 'evenodd' : undefined"
    />
  </svg>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../types/globals";
import { mapStores } from "pinia";
import { usePostsStore } from "../stores/postsStore.ts";
import { IResponse } from "../types/helpers";

export default {
  props: {
    post: {
      type: Object as PropType<IPost>,
      required: true,
    },
  },
  computed: {
    ...mapStores(usePostsStore),
  },
  methods: {
    async toggleSavePost() {
      const action = !this.post.is_saved;
      const response: IResponse = action
        ? await this.postsStore.addPostToSaved(this.post.id)
        : await this.postsStore.removePostFromSaved(this.post.id);

      if (response.success) {
        this.post.is_saved = action;
      }
    },
  },
};
</script>
