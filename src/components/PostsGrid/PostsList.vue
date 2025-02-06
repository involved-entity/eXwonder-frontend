<template>
  <div v-for="(post, index) in posts" :key="post.id">
    <div
      class="group relative cursor-pointer"
      :class="{
        'ml-0.5 mt-0.5': index === 0,
        scrollEnd: index === posts.length - 1,
      }"
      @click="$emit('postClick', post)"
    >
      <div class="relative overflow-hidden">
        <img
          :src="post.images[0].image_crop"
          alt="Post image"
          class="block w-full h-full object-cover object-center mx-auto dark:group-hover:opacity-40"
        />
        <div
          class="absolute h-full inset-0 group-hover:bg-black group-hover:bg-opacity-40 dark:group-hover:bg-opacity-0"
        ></div>
      </div>

      <div
        class="absolute top-1.5 right-1.5 opacity-100 text-lg text-white transform rotate-45"
        v-if="post.pinned"
      >
        <svg
          fill="currentColor"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 50.002 50.002"
          xml:space="preserve"
          class="size-6 text-white"
        >
          <g>
            <path
              d="M40.194,24.752c-0.498,0-1.022-0.343-1.143-0.771L32.381,2.829c-0.118-0.421,0.181-0.767,0.679-0.767h0.547
            c0.517,0,0.92-0.355,0.92-0.792V0.792c0-0.433-0.403-0.792-0.92-0.792H16.397c-0.517,0-0.92,0.359-0.92,0.792l0.001,0.479
            c0,0.437,0.403,0.794,0.921,0.794l0.547-0.003c0.497,0,0.813,0.346,0.677,0.767l-6.672,21.153
            c-0.118,0.427-0.645,0.771-1.143,0.771H9.241c-0.497,0-0.9,0.351-0.9,0.788v2.541c0,0.438,0.403,0.797,0.9,0.797h10.772
            c0.497,0,0.979,0.348,1.065,0.782l3.776,20.021c0.087,0.428,0.206,0.428,0.295,0l3.793-20.021c0.067-0.435,0.551-0.782,1.047-0.782
            h10.771c0.497,0,0.899-0.359,0.899-0.797l0.001-2.541c0-0.437-0.402-0.788-0.898-0.788L40.194,24.752L40.194,24.752z"
            />
          </g>
        </svg>
      </div>

      <div
        class="absolute top-1.5 right-1.5 opacity-100 text-lg text-white"
        v-else-if="post.images.length > 1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            d="M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z"
          />
          <path
            d="M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z"
          />
        </svg>
      </div>

      <div
        class="absolute top-1/2 left-1/2 flex opacity-0 group-hover:opacity-100 text-lg text-white font-semibold space-x-5"
        style="transform: translate(-50%, -50%)"
      >
        <div class="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
            />
          </svg>
          <span class="varela-round" style="font-size: 24px">{{ post.likes_count }}</span>
        </div>

        <div class="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="varela-round" style="font-size: 24px">{{ post.comments_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IPost } from "../../types/globals";

export default {
  emits: ["postClick"],
  name: "PostsList",
  props: {
    posts: { type: Array as () => Array<IPost>, required: true },
  },
};
</script>
