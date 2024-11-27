<template>
  <div
    class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center z-50"
  >
    <div class="flex h-5/6 text-gray-700 dark:text-gray-300">
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
        <img
          :src="post.images[activeImage].image"
          alt="Post image"
          class="max-h-full"
          ref="image"
        />
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
      <div
        class="rounded-2xl overflow-y-auto overflow-x-hidden flex flex-col mb-auto max-h-full lg:w-[21rem] xl:w-[24rem] bg-gray-200 dark:bg-[#111]"
        ref="commentsBlock"
      >
        <div
          class="sticky top-0 left-0 pt-3 pb-1 bg-gray-300 dark:bg-[#070707]"
        >
          <div class="grid grid-cols-2 mx-3">
            <div class="col-span-1 text-2xl flex justify-start">
              Comments
              <div class="ms-1 varela-round">({{ post.comments_count }})</div>
            </div>
            <div class="flex col-span-1 ms-auto">
              <div
                class="mr-1"
                v-if="post.author.id === authenticationStore.user.id"
              >
                <button
                  id="dropdownButton"
                  class="cursor-pointer"
                  type="button"
                >
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
                  id="dropdownMenu"
                  class="z-10 hidden shadow-xl shadow-slate-500/30 dark:shadow-none bg-gray-300 dark:bg-[#1b1919] divide-y divide-gray-100 border-red rounded w-36"
                >
                  <ul class="py-1 text-sm" aria-labelledby="dropdownButton">
                    <li>
                      <button
                        class="px-3 py-2 text-red-600 flex"
                        @click="postDelete"
                      >
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
              <div class="cursor-pointer" @click="close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="ps-3 pr-3 h-1">
            <hr class="border border-gray-600" />
          </div>
          <div class="m-2 w-full grid grid-cols-8">
            <router-link
              :to="'/' + post.author.username + '/'"
              class="col-span-1"
              active-class=""
              @click="routeStore.changeActiveLink('user')"
            >
              <img
                :src="post.author.avatar"
                alt="avatar"
                class="w-11 h-11 rounded-full mx-auto"
              />
            </router-link>
            <div class="ms-3 col-span-6">
              <div
                class="flex"
                :class="{ 'h-full items-center': !post.signature.length }"
              >
                <router-link
                  :to="'/' + post.author.username + '/'"
                  class="hover:text-gray-600 dark:hover:text-gray-400"
                  active-class=""
                  @click="routeStore.changeActiveLink('user')"
                >
                  {{ post.author.username }}
                </router-link>
                <p
                  class="text-gray-600 dark:text-gray-400 text-sm ms-2 montserrat"
                >
                  {{ post.time_added.time_added }} ago
                </p>
              </div>
              <div
                class="text-gray-600 dark:text-gray-500 text-sm"
                v-if="post.signature.length && post.signature.length <= 100"
              >
                {{ post.signature }}
              </div>
              <div
                class="text-gray-600 dark:text-gray-500 text-sm cursor-pointer"
                v-if="post.signature.length && post.signature.length > 100"
                @click="signatureExpanded = !signatureExpanded"
              >
                {{
                  signatureExpanded
                    ? post.signature
                    : post.signature.slice(0, 32)
                }}
                <span class="text-white" v-if="!signatureExpanded">...</span>
              </div>
            </div>
            <div class="col-span-1 justify-end">
              <app-save-post-button :post="post" />
            </div>
          </div>
        </div>
        <div class="m-2">
          <div class="py-10" v-if="commentsLoading">
            <div class="loader mx-auto"></div>
          </div>

          <div class="mt-1" v-else-if="comments.length">
            <div
              class="mb-3 grid grid-cols-8"
              v-for="comment in comments"
              :key="comment.id"
            >
              <router-link
                :to="'/' + comment.author.username + '/'"
                class="col-span-1"
                @click="routeStore.changeActiveLink('user')"
              >
                <img
                  :src="comment.author.avatar"
                  alt="avatar"
                  class="w-11 rounded-full h-11 mx-auto"
                />
              </router-link>
              <div class="ms-3 col-span-6">
                <div class="flex">
                  <router-link
                    :to="'/' + comment.author.username + '/'"
                    class="hover:text-gray-600 dark:hover:text-gray-400"
                    @click="routeStore.changeActiveLink('user')"
                  >
                    {{ comment.author.username }}
                  </router-link>
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
                    @click="commentDelete(comment)"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
                <div class="text-gray-600 dark:text-gray-500 text-sm">
                  {{ comment.comment }}
                </div>
              </div>
              <div class="col-span-1 justify-end">
                <app-comment-like-button :comment="comment" />
              </div>
            </div>
          </div>

          <div
            class="text-center text-3xl text-gray-600 dark:text-gray-500 h-full"
            v-else
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-36 mx-auto"
            >
              <path
                d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z"
              />
              <path
                d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z"
              />
            </svg>
            No comments
          </div>
        </div>
        <div
          class="sticky bottom-0 left-0 w-full py-3 grid grid-cols-12 bg-gray-300 dark:bg-[#070707] h-[28%]"
        >
          <div class="col-span-2">
            <app-like-button :post="post" />
          </div>
          <div class="col-span-8">
            <div class="h-full">
              <textarea
                class="w-full outline-none p-1 border bg-gray-200 dark:bg-[#090909]"
                :class="{
                  'border-red-600': errors.commentInput,
                  'border-transparent': !errors.commentInput,
                }"
                v-model="commentInput"
                @keyup.ctrl.enter="createComment"
              ></textarea>
              <p>
                <small
                  class="py-1 text-red-600"
                  :class="{
                    'text-red-600': errors.commentInput?.length,
                    'text-transparent': !errors.commentInput?.length,
                  }"
                  v-if="errors.commentInput?.length"
                  >{{ errors.commentInput }}</small
                >
              </p>
            </div>
          </div>
          <div class="col-span-2 ms-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 cursor-pointer"
              @click="createComment"
            >
              <path
                d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { useCommentsStore } from "../stores/commentsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { usePostsStore } from "../stores/postsStore.ts";
import { useRouteStore } from "../stores/routeStore.ts";
import { mapStores } from "pinia";
import AppLikeButton from "./AppLikeButton.vue";
import AppSavePostButton from "./AppSavePostButton.vue";
import AppCommentLikeButton from "./AppCommentLikeButton.vue";
import { Dropdown } from "flowbite";
import { IComment, IPost } from "@/types/globals";

export default {
  components: { AppCommentLikeButton, AppSavePostButton, AppLikeButton },
  emits: ["close"],
  props: {
    post: {
      type: Object as PropType<IPost>,
      required: true,
    },
  },
  data() {
    return {
      activeImage: 0,
      commentsLoading: false,
      signatureExpanded: false,
      comments: [] as Array<IComment>,
      commentInput: "",
      errors: { commentInput: undefined as string | undefined },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

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

    async createComment() {
      if (this.commentInput.length >= 10 && this.commentInput.length <= 2048) {
        const { success } = await this.commentsStore.addComment(
          this.post.id,
          this.commentInput
        );
        if (success) {
          this.errors.commentInput = undefined;
          this.commentInput = "";
          this.post.comments_count += 1;
          await this.updateComments();
        }
      } else {
        this.errors.commentInput = "Comment too short or so long.";
      }
    },

    async updateComments() {
      this.commentsLoading = true;
      const comments = await this.commentsStore.getPostComments(this.post.id);
      this.comments = comments.data.results;
      this.commentsLoading = false;
    },

    async postDelete() {
      if (this.authenticationStore.user.id === this.post.author.id) {
        const { success } = await this.postsStore.deletePost(this.post.id);
        if (success) {
          this.$router.push({ name: "feed" });
        }
      }
    },

    getCommentIndex(commentToFind: IComment) {
      let retIndex: number = 0;
      this.comments.forEach((comment, index) => {
        if (comment.id === commentToFind.id) {
          retIndex = index;
        }
      });
      return retIndex;
    },

    async commentDelete(comment: IComment) {
      if (this.authenticationStore.user.id === comment.author.id) {
        const { success } = await this.commentsStore.deleteComment(comment.id);
        if (success) {
          this.comments.splice(this.getCommentIndex(comment), 1);
          this.post.comments_count--;
        }
      }
    },

    handleClick(event: Event) {
      const prevImageBtn = this.$refs.prevImageBtn as HTMLElement;
      const nextImageBtn = this.$refs.nextImageBtn as HTMLElement;
      const image = this.$refs.image as HTMLElement;
      const commentsBlock = this.$refs.commentsBlock as HTMLElement;
      if (
        !prevImageBtn.contains(event.target) &&
        !nextImageBtn.contains(event.target) &&
        !image.contains(event.target) &&
        !commentsBlock.contains(event.target)
      ) {
        this.close();
      }
    },
  },

  async mounted() {
    await this.updateComments();

    document.body.addEventListener("click", this.handleClick);

    const $targetEl = document.getElementById("dropdownMenu");
    const $triggerEl = document.getElementById("dropdownButton");

    const options = {
      placement: "bottom",
      offsetSkidding: 0,
      offsetDistance: 10,
    };

    if ($targetEl) {
      new Dropdown($targetEl, $triggerEl, options);
    }
  },

  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },

  computed: {
    ...mapStores(
      useCommentsStore,
      useAuthenticationStore,
      usePostsStore,
      useRouteStore
    ),
  },
};
</script>
