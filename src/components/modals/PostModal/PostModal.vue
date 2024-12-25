<template>
  <div class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center z-50">
    <div class="flex h-5/6 text-gray-700 dark:text-gray-300">
      <ImagesCarousel ref="carousel" :post="post" />
      <div
        class="rounded-2xl overflow-y-auto overflow-x-hidden flex flex-col mb-auto max-h-full lg:w-[21rem] xl:w-[24rem] bg-gray-200 dark:bg-[#111]"
        ref="commentsBlock"
      >
        <div class="sticky top-0 left-0 pt-3 pb-1 bg-gray-300 dark:bg-[#070707]">
          <div class="grid grid-cols-2 mx-3">
            <div class="col-span-1 text-2xl flex justify-start">
              Comments
              <div class="ms-1 varela-round">({{ post.comments_count }})</div>
            </div>
            <div class="flex col-span-1 ms-auto">
              <DeleteDropdown
                v-if="post.author.id === authenticationStore.user.id"
                @delete="postDelete"
              />
              <ModalCloseButton @close="close" />
            </div>
          </div>
          <div class="ps-3 pr-3 h-1">
            <hr class="border border-gray-600" />
          </div>
          <PostBasicInfo :post="post" />
        </div>
        <div class="m-2">
          <div class="py-10" v-if="commentsLoading">
            <div class="loader mx-auto"></div>
          </div>

          <div class="mt-1" v-else-if="comments.length">
            <CommentsList :comments="comments" @commentDelete="commentDelete" />
          </div>

          <div class="text-center text-3xl text-gray-600 dark:text-gray-500 h-full" v-else>
            <NoCommentsSvg />
            No comments
          </div>
        </div>
        <div
          class="sticky bottom-0 left-0 w-full py-3 grid grid-cols-12 bg-gray-300 dark:bg-[#070707] h-[28%]"
        >
          <div class="col-span-2">
            <PostLikeButton :post="post" />
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
import { clearActiveClasses } from "../../../helpers";
import { PropType } from "vue";
import { useCommentsStore } from "../../../stores/commentsStore.ts";
import { useAuthenticationStore } from "../../../stores/authenticationStore.ts";
import { usePostsStore } from "../../../stores/postsStore.ts";
import { mapStores } from "pinia";
import PostLikeButton from "../../PostLikeButton.vue";
import { IComment, IPost } from "../../../types/globals";
import DeleteDropdown from "../../DeleteDropdown.vue";
import ImagesCarousel from "./ImagesCarousel.vue";
import ModalCloseButton from "../ModalCloseButton.vue";
import CommentsList from "../CommentsList.vue";
import NoCommentsSvg from "../NoCommentsSvg.vue";
import PostBasicInfo from "./PostBasicInfo.vue";

export default {
  components: {
    PostBasicInfo,
    NoCommentsSvg,
    CommentsList,
    ModalCloseButton,
    ImagesCarousel,
    DeleteDropdown,
    PostLikeButton,
  },
  emits: ["close"],
  props: {
    post: {
      type: Object as PropType<IPost>,
      required: true,
    },
  },
  data() {
    return {
      commentsLoading: false,
      comments: [] as Array<IComment>,
      commentInput: "",
      errors: { commentInput: undefined as string | undefined },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async createComment() {
      const { length } = this.commentInput;
      if (length >= 10 && length <= 2048) {
        const { success } = await this.commentsStore.addComment(this.post.id, this.commentInput);
        if (success) {
          this.resetCommentInput();
          this.post.comments_count++;
          await this.updateComments();
        }
      } else {
        this.errors.commentInput = "Comment too short or too long.";
      }
    },

    resetCommentInput() {
      this.errors.commentInput = undefined;
      this.commentInput = "";
    },

    async updateComments() {
      this.commentsLoading = true;
      try {
        const comments = await this.commentsStore.getPostComments(this.post.id);
        this.comments = comments.data.results;
      } finally {
        this.commentsLoading = false;
      }
    },

    async postDelete() {
      if (this.isUserPostAuthor) {
        const { success } = await this.postsStore.deletePost(this.post.id);
        if (success) {
          this.$router.go(0);
        }
      }
    },

    getCommentIndex(commentToFind: IComment): number {
      return this.comments.findIndex(comment => comment.id === commentToFind.id);
    },

    async commentDelete(comment: IComment) {
      if (this.isUserCommentAuthor(comment)) {
        const { success } = await this.commentsStore.deleteComment(comment.id);
        if (success) {
          this.comments.splice(this.getCommentIndex(comment), 1);
          this.post.comments_count--;
        }
      }
    },

    isUserCommentAuthor(comment: IComment): boolean {
      return this.authenticationStore.user.id === comment.author.id;
    },

    handleClick(event: Event) {
      const { carousel, image, commentsBlock } = this.$refs;
      if (
        !this.isClickInsideRefs(event, carousel, image as HTMLElement, commentsBlock as HTMLElement)
      ) {
        this.close();
      }
    },

    isClickInsideRefs(
      event: Event,
      carousel: any,
      image: HTMLElement,
      commentsBlock: HTMLElement
    ): boolean {
      const prevImageBtn = carousel?.$refs.prevImageBtn as HTMLElement;
      const nextImageBtn = carousel?.$refs.nextImageBtn as HTMLElement;
      return (
        (prevImageBtn && prevImageBtn.contains(event.target as Node)) ||
        (nextImageBtn && nextImageBtn.contains(event.target as Node)) ||
        (image && image.contains(event.target as Node)) ||
        (commentsBlock && commentsBlock.contains(event.target as Node))
      );
    },
  },

  async mounted() {
    clearActiveClasses();
    await this.updateComments();
    document.body.addEventListener("click", this.handleClick);
  },

  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },

  updated() {
    clearActiveClasses();
  },

  computed: {
    ...mapStores(useCommentsStore, useAuthenticationStore, usePostsStore),
    isUserPostAuthor() {
      return this.authenticationStore.user.id === this.post.author.id;
    },
  },
};
</script>
