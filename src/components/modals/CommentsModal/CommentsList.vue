<template>
  <div
    class="mb-3 grid grid-cols-8"
    v-for="comment in comments"
    :key="comment.id"
  >
    <RouterLink
      :to="'/' + comment.author.username + '/'"
      class="col-span-1"
    >
      <img
        :src="comment.author.avatar"
        alt="avatar"
        class="w-11 rounded-full h-11 mx-auto"
      />
    </RouterLink>
    <div class="ms-3 col-span-6">
      <div class="flex">
        <RouterLink
          :to="'/' + comment.author.username + '/'"
          class="hover:text-gray-600 dark:hover:text-gray-400"
        >
          {{ comment.author.username }}
        </RouterLink>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm ms-2 my-auto montserrat"
        >
          {{ comment.time_added.time_added }} ago
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4 ms-2 my-auto text-red-600 cursor-pointer"
          v-if="authenticationStore.user.id === comment.author.id"
          @click="$emit('commentDelete', comment)"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>
      <div class="text-gray-500 text-sm">{{ comment.comment }}</div>
    </div>
    <div class="col-span-1 justify-end">
      <AppCommentLikeButton :comment="comment" />
    </div>
  </div>
</template>

<script lang="ts">
import AppCommentLikeButton from "../../AppCommentLikeButton.vue";
import { IComment } from "../../../types/globals";
import {useAuthenticationStore} from "../../../stores/authenticationStore.ts";
import {mapStores} from 'pinia'

export default {
  emits: ["commentDelete"],
  name: "CommentsList",
  components: { AppCommentLikeButton },
  props: {
    comments: {
      type: Array as () => IComment[]
    },
  },
  computed: {...mapStores(useAuthenticationStore)}
};
</script>
