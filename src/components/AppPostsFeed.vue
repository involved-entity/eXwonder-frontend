<template>
  <div class="max-w-sm px-3 mx-auto">
    <div class="flex text-gray-700 dark:text-gray-300 my-3" v-if="closableMode">
      <button type="button" class="cursor-pointer" @click="$emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <div class="ms-1">{{ posts[0].author.username }}'s post</div>
    </div>
    <div class="pb-3" v-for="post in posts" :key="post.id">
      <div class="flex w-full mb-1">
        <router-link :to="'/' + post.author.username + '/'">
          <img :src="post.author.avatar" alt="avatar" class="size-8 rounded-full" />
        </router-link>
        <p class="text-gray-700 dark:text-gray-300 text-md my-auto ms-1">
          <router-link :to="'/' + post.author.username + '/'" class="hover:text-gray-400">
            {{ post.author.username }}
          </router-link>
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
                  <button class="px-3 py-2 text-red-600 flex" @click="postDelete(post)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    <span class="ms-1">Delete post</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
          @click="changeImage(post, false)"
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
        <app-swipe-component
          class="block lg:hidden"
          @swipe-left="changeImage(post, false)"
          @swipe-right="changeImage(post)"
        >
          <img
            :src="post.images[post.activeImage!].image"
            alt="Post image"
            class="max-h-full rounded"
          />
        </app-swipe-component>
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
          @click="changeImage(post)"
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
      <div class="mt-1">
        <div class="grid grid-cols-12">
          <div class="col-span-10 flex">
            <div class="text-gray-700 dark:text-gray-300">
              <PostLikeButton :post="post" :centered="false" :flex-likes-count="true" />
            </div>
            <div class="flex text-gray-700 dark:text-gray-300 ms-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                :class="{ hidden: post.is_commented }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
                :class="{ hidden: !post.is_commented }"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                class="text-white ms-1 varela-round"
                :class="{
                  'text-xl': String(post.comments_count).length <= 2,
                  'text-md': String(post.comments_count).length > 2,
                }"
                >{{ post.comments_count }}</span
              >
            </div>
          </div>
          <div class="col-span-2">
            <div class="flex text-gray-700 dark:text-gray-300 justify-end">
              <app-save-post-button :post="post"></app-save-post-button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-gray-600 dark:text-gray-300" v-if="post.signature.length">
        <span class="text-gray-700 dark:text-white montserrat-bold">{{
          post.author.username
        }}</span>
        {{ post.signature }}
      </div>
      <div>
        <button
          class="text-gray-700 dark:text-white montserrat-bold hover:text-gray-600 dark:hover:text-gray-400"
          @click="showComments(post)"
          v-if="post.comments_count > 0"
        >
          View all
          <span class="varela-round">{{ post.comments_count }}</span> comments
        </button>
      </div>
      <div class="w-full flex">
        <div class="w-11/12">
          <textarea
            class="text-gray-600 dark:text-gray-400 bg-gray-custom w-full text-sm p-1 outline-none rounded mt-1 border"
            :class="{
              'border-red-600': errors[post.id],
              'border-transparent': !errors[post.id],
            }"
            :ref="'comment_input_' + String(post.id)"
            @keyup.ctrl.enter="createComment(post)"
          ></textarea>
          <p v-if="errors[post.id]">
            <small class="py-1 text-red-600">{{ errors[post.id] }}</small>
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6 cursor-pointer my-auto text-gray-700 dark:text-gray-300 w-1/12"
          @click="createComment(post)"
        >
          <path
            d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
          />
        </svg>
      </div>
      <div class="h-1 pt-3">
        <hr class="border border-gray-600" />
      </div>
    </div>
    <PostModal
      :post="activeModalPost"
      v-if="activeModalPost?.id!"
      @close="activeModalPost = undefined"
    />
    <CommentsModal
      :post="activeModalCommmentsPost"
      v-if="activeModalCommmentsPost?.id!"
      @close="activeModalCommmentsPost = undefined"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../types/globals";
import PostLikeButton from "./PostLikeButton.vue";
import PostModal from "./modals/PostModal/PostModal.vue";
import AppSavePostButton from "./AppSavePostButton.vue";
import AppSwipeComponent from "./AppSwipeComponent.vue";
import CommentsModal from "./modals/CommentsModal/CommentsModal.vue";
import { useCommentsStore } from "../stores/commentsStore.ts";
import { usePostsStore } from "../stores/postsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { mapStores } from "pinia";
import { Dropdown } from "flowbite";

export default {
  components: {
    AppSavePostButton,
    PostLikeButton,
    PostModal,
    AppSwipeComponent,
    CommentsModal,
  },
  emits: ["close"],
  props: {
    posts: {
      type: Array as PropType<Array<IPost>>,
      required: true,
    },
    closableMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      activeModalPost: {} as IPost | undefined,
      activeModalCommmentsPost: {} as IPost | undefined,
      errors: {} as Record<number, string | undefined>,
    };
  },
  methods: {
    showComments(post: IPost) {
      if (window.innerWidth >= 1024) {
        this.activeModalPost = post;
      } else {
        this.activeModalCommmentsPost = post;
      }
    },
    changeImage(post: IPost, next: boolean = true) {
      if (next && post.activeImage! < post.images.length - 1) {
        post.activeImage!++;
      } else if (!next && post.activeImage !== 0) {
        post.activeImage!--;
      }
    },
    async createComment(post: IPost) {
      const commentInput = this.$refs[`comment_input_${post.id}`] as HTMLInputElement[];
      if (commentInput[0].value.length >= 10 && commentInput[0].value.length <= 2048) {
        const { success } = await this.commentsStore.addComment(post.id, commentInput[0].value);
        if (success) {
          this.errors[`${post.id}`] = undefined;
          commentInput[0].value = "";
          post.comments_count += 1;
          post.is_commented = true;
        }
      } else {
        this.errors[post.id] = "Comment too short or so long.";
      }
    },
    getPostIndex(postToFind: IPost) {
      let retIndex: number = 0;
      this.posts.forEach((post: IPost, index: number) => {
        if (post.id === postToFind.id) {
          retIndex = index;
        }
      });
      return retIndex;
    },
    async postDelete(post: IPost) {
      if (this.authenticationStore.user.id === post.author.id) {
        const { success } = await this.postsStore.deletePost(post.id);
        if (success) {
          if (this.closableMode) {
            this.$router.push({
              path: "/" + this.authenticationStore.user.username + "/",
              query: { action: "post-deleted" },
            });
          } else {
            this.posts.splice(this.getPostIndex(post), 1);
          }
        }
      }
    },
  },
  mounted() {
    this.posts.forEach((post: IPost) => {
      const $targetEl = document.getElementById(`dropdownMenu${post.id}`);
      const $triggerEl = document.getElementById(`dropdownButton${post.id}`);

      const options = {
        placement: "bottom",
        offsetSkidding: 0,
        offsetDistance: 10,
      };

      if ($targetEl) {
        new Dropdown($targetEl, $triggerEl, options);
      }
    });
  },
  computed: {
    ...mapStores(useCommentsStore, usePostsStore, useAuthenticationStore),
  },
};
</script>
