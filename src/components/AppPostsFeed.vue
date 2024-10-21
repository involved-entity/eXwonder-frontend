<template>
  <div class="max-w-md px-3 mx-auto">
    <div class="pb-3" v-for="post in posts" :key="post.id">
      <div class="flex w-full mb-1">
        <router-link :to="'/' + post.author.username + '/'">
          <img :src="post.author.avatar" alt="avatar" class="size-8 rounded-full">
        </router-link>
        <p class="text-gray-300 text-md my-auto ms-1">
          <router-link :to="'/' + post.author.username + '/'" class="hover:text-gray-400">
            {{post.author.username}}
          </router-link>
        </p>
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
      <div class="flex mt-1">
        <div class="text-gray-300">
          <app-like-button :post="post" :centered="false" :flex-likes-count="true"></app-like-button>
        </div>
        <div class="flex text-gray-300 ms-1">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              :class="{'hidden': post.is_commented}"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
              :class="{'hidden': !post.is_commented}"
          >
            <path fill-rule="evenodd" d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z" clip-rule="evenodd" />
          </svg>
          <span
              class="text-white"
              :class="{'text-xl': String(post.comments_count).length <= 2, 'text-md': String(post.comments_count).length > 2}"
          >{{post.comments_count}}</span>
        </div>
      </div>
      <div class="text-gray-300" v-if="post.signature.length">
        <span class="text-white font-extrabold">{{post.author.username}}</span> {{post.signature}}
      </div>
      <div>
        <button
            class="text-white font-extrabold hover:text-gray-400"
            @click="activeModalPost = post"
            v-if="post.comments_count > 0"
        >View all {{post.comments_count}} comments</button>
      </div>
      <div class="flex">
        <textarea
            placeholder="Your comment here"
            class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
            @keyup.ctrl.enter="createComment"
        ></textarea>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 cursor-pointer my-auto text-gray-300"
            @click="createComment"
        >
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </div>
      <div class="h-1 pt-3">
        <hr class="border border-gray-600">
      </div>
    </div>
    <app-post-modal :post="activeModalPost" v-if="activeModalPost.id" @close="activeModalPost = {}"></app-post-modal>
  </div>
</template>

<script>
import AppLikeButton from "./AppLikeButton.vue";
import AppPostModal from "./AppPostModal.vue";

export default {
  components: {AppLikeButton, AppPostModal},
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeModalPost: {}
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
