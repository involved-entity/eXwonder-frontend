<template>
  <div class="flex w-full mb-1">
    <RouterLink :to="{ name: 'user', params: { username: post.author.username } }">
      <img :src="post.author.avatar" alt="avatar" class="size-8 rounded-full" />
    </RouterLink>
    <p class="text-gray-700 dark:text-gray-300 text-md my-auto ms-1">
      <RouterLink
        :to="{ name: 'user', params: { username: post.author.username } }"
        class="hover:text-gray-400"
      >
        {{ post.author.username }}
      </RouterLink>
    </p>
    <div class="flex ms-auto">
      <p class="text-gray-600 dark:text-gray-500 text-sm lg:text-md my-auto montserrat">
        {{ post.time_added.time_added }} ago
      </p>
      <div
        class="mx-1 text-gray-700 dark:text-gray-300"
        v-if="post.author.id === authenticationStore.user.id"
      >
        <button :id="`dropdownButton${post.id}`" class="cursor-pointer" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
        <div
          :id="`dropdownMenu${post.id}`"
          class="z-10 hidden shadow-xl shadow-slate-500/30 dark:shadow-none bg-gray-300 dark:bg-[#1b1919] divide-y divide-gray-100 border-red rounded w-36"
        >
          <ul class="py-1 text-sm text-gray-300" aria-labelledby="dropdownButton">
            <li>
              <button class="px-3 py-2 text-red-600 flex" @click="$emit('postDelete', post)">
                <span class="ms-1">Delete post</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../../stores/authenticationStore.ts";
import { IPost } from "../../types/globals";

export default {
  emits: ["postDelete"],
  name: "FeedHeader",
  props: {
    post: { type: Object as () => IPost, required: true },
  },
  computed: {
    ...mapStores(useAuthenticationStore),
  },
};
</script>
