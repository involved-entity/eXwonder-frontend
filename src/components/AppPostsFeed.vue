<template>
  <div class="max-w-md px-3 mx-auto">
    <div class="mb-3" v-for="post in posts" :key="post.id">
      <div class="flex w-full mb-1">
        <img :src="post.author.avatar" alt="avatar" class="size-8 rounded-full">
        <p class="text-gray-300 text-md my-auto ms-1">{{post.author.username}}</p>
        <p class="text-gray-600 text-md my-auto ms-auto">{{post.time_added.time_added}}</p>
      </div>
      <div class="relative">
        <button class="size-7 absolute left-1 top-1/2 bg-gray-50 rounded-full"
                :class="{'opacity-100 cursor-pointer': post.activeImage > 0, 'opacity-0': post.activeImage <= 0}"
                style="transform: translateY(-50%)"
                @click="changeImage(post,false)"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-7 ms-auto my-auto text-gray-700"
          >
            <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
          </svg>
        </button>
        <img :src="post.images[post.activeImage].image" alt="Post image" class="max-h-full rounded">
        <button class="size-7 absolute right-1 top-1/2 bg-gray-50 rounded-full"
                :class="{'opacity-100 cursor-pointer': post.activeImage + 1 < post.images.length, 'opacity-0': post.activeImage + 1 >= post.images.length}"
                style="transform: translateY(-50%)"
                @click="changeImage(post)"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-7 ms-auto my-auto text-gray-700"
          >
            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="flex">
        <div class="text-gray-300">
          <app-like-button :post="post" :centered="false" :flex-likes-count="true"></app-like-button>
        </div>
        <div class="flex text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z" clip-rule="evenodd" />
          </svg>
          <span
              :class="{'text-xl': String(post.comments_count).length <= 2, 'text-md': String(post.comments_count).length > 2}"
          >{{post.comments_count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLikeButton from "./AppLikeButton.vue";

export default {
  components: {AppLikeButton},
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  methods: {
    changeImage(post, next = true) {
      if (next) {
        post.activeImage++
      } else {
        post.activeImage--
      }
    }
  }
}
</script>
