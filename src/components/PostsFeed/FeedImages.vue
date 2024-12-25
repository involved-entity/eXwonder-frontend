<template>
  <div class="relative">
    <div
      class="absolute left-1 top-1 bg-black rounded-xl text-xs text-white px-2 py-0.5 mx-auto"
      v-if="post.images.length > 1"
    >
      {{ post.activeImage! + 1 }}/{{ post.images.length }}
    </div>
    <button
      class="size-7 absolute left-1 top-1/2 bg-gray-50 rounded-full hidden lg:block"
      :class="{
        'opacity-100 cursor-pointer': post.activeImage! > 0,
        'opacity-0': post.activeImage! <= 0,
      }"
      style="transform: translateY(-50%)"
      @click="changeImage(false)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-7 ms-auto my-auto text-gray-700"
      >
        <path
          fill-rule="evenodd"
          d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <SwipeComponent
      class="block lg:hidden"
      @swipe-left="changeImage(false)"
      @swipe-right="changeImage"
    >
      <img
        :src="post.images[post.activeImage!].image"
        alt="Post image"
        class="max-h-full rounded"
      />
    </SwipeComponent>
    <img
      :src="post.images[post.activeImage!].image"
      alt="Post image"
      class="max-h-full rounded hidden lg:block"
    />
    <button
      class="size-7 absolute right-1 top-1/2 bg-gray-50 rounded-full hidden lg:block"
      :class="{
        'opacity-100 cursor-pointer': post.activeImage! + 1 < post.images.length,
        'opacity-0': post.activeImage! + 1 >= post.images.length,
      }"
      style="transform: translateY(-50%)"
      @click="changeImage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-7 ms-auto my-auto text-gray-700"
      >
        <path
          fill-rule="evenodd"
          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import SwipeComponent from "../SwipeComponent.vue";
import { IPost } from "../../types/globals";

export default {
  name: "FeedImages",
  components: { SwipeComponent },
  props: {
    post: { type: Object as () => IPost, required: true },
  },
  methods: {
    changeImage(next: boolean = true) {
      if (next) {
        this.post.activeImage = Math.min(this.post.activeImage! + 1, this.post.images.length - 1);
      } else {
        this.post.activeImage = Math.max(this.post.activeImage! - 1, 0);
      }
    },
  }
};
</script>
