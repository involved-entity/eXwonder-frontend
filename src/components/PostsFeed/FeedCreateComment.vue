<template>
  <div class="w-full flex">
    <div class="w-11/12">
      <textarea
        class="text-gray-600 dark:text-gray-400 bg-gray-custom w-full text-sm p-1 outline-none rounded mt-1 border"
        :class="{ 'border-red-600': error, 'border-transparent': !error }"
        v-model="comment"
        @keyup.ctrl.enter="createComment"
      ></textarea>
      <p v-if="error">
        <small class="py-1 text-red-600">{{ error }}</small>
      </p>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6 cursor-pointer my-auto text-gray-700 dark:text-gray-300 w-1/12"
      @click="createComment"
    >
      <path
        d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { IPost } from "../../types/globals";
import { mapStores } from "pinia";
import { useCommentsStore } from "../../stores/commentsStore.ts";

export default {
  name: "FeedCreateComment",
  props: {
    post: { type: Object as () => IPost, required: true },
  },
  data() {
    return {
      error: '',
      comment: '',
    }
  },
  methods: {
    async createComment() {
      if (this.comment.length >= 10 && this.comment.length <= 2048) {
        const { success } = await this.commentsStore.addComment(this.post.id, this.comment);
        if (success) {
          this.error = '';
          this.comment = "";
          this.post.comments_count += 1;
          this.post.is_commented = true;
        }
      } else {
        this.error = "Comment too short or so long.";
      }
    },
  },
  computed: {
    ...mapStores(useCommentsStore)
  }
};
</script>
