<template>
  <div class="w-4/6 flex">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-10 ms-auto my-auto"
      :class="{
        'opacity-100 cursor-pointer': activeImage > 0,
        'opacity-0': activeImage <= 0,
      }"
      @click="prevImage"
      ref="prevImageBtn"
    >
      <path
        fill-rule="evenodd"
        d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
        clip-rule="evenodd"
      />
    </svg>
    <img :src="post.images[activeImage].image" alt="Post image" class="max-h-full" ref="image" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-10 me-auto my-auto"
      :class="{
        'opacity-100 cursor-pointer': activeImage + 1 < post.images.length,
        'opacity-0': activeImage + 1 >= post.images.length,
      }"
      @click="nextImage"
      ref="nextImageBtn"
    >
      <path
        fill-rule="evenodd"
        d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { IPost } from "../../../types/globals";

export default {
  name: "ImagesCarousel",
  props: {
    post: {
      type: Object as () => IPost,
      required: true,
    },
  },
  data: () => ({
    activeImage: 0 as number,
  }),
  methods: {
    prevImage() {
      if (this.activeImage > 0) {
        this.activeImage--;
      }
    },

    nextImage() {
      if (this.activeImage + 1 < this.post.images.length) {
        this.activeImage++;
      }
    },
  },
};
</script>
